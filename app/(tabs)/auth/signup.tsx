import { Colors } from '@/constants/theme';
import { setCurrentUserId } from '@/lib/data-service';
import { supabase } from '@/utils/supabase';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { z } from 'zod';

const ACCENT_COLOR = Colors.light.tint;

const LANGUAGES = [
  { label: '🇺🇸 English', value: 'en' },
  { label: '🇭🇰 繁體中文 (Hong Kong)', value: 'zh-HK' },
  { label: '🇨🇳 简体中文', value: 'zh-CN' },
  { label: '🇹🇼 繁體中文 (Taiwan)', value: 'zh-TW' },
  { label: '🇯🇵 日本語', value: 'ja' },
  { label: '🇰🇷 한국어', value: 'ko' },
  { label: '🇫🇷 Français', value: 'fr' },
  { label: '🇩🇪 Deutsch', value: 'de' },
  { label: '🇪🇸 Español', value: 'es' },
  { label: '🇵🇹 Português', value: 'pt' },
  { label: '🇮🇹 Italiano', value: 'it' },
  { label: '🇷🇺 Русский', value: 'ru' },
  { label: '🇹🇭 ไทย', value: 'th' },
  { label: '🇻🇳 Tiếng Việt', value: 'vi' },
  { label: '🇮🇩 Bahasa Indonesia', value: 'id' },
  { label: '🇲🇾 Bahasa Melayu', value: 'ms' },
  { label: '🇮🇳 हिन्दी', value: 'hi' },
  { label: '🇸🇦 العربية', value: 'ar' },
  { label: '🇹🇷 Türkçe', value: 'tr' },
  { label: '🇳🇱 Nederlands', value: 'nl' },
  { label: '🇵🇱 Polski', value: 'pl' },
  { label: '🇸🇪 Svenska', value: 'sv' },
] as const;

const languageValues = LANGUAGES.map((l) => l.value);

function LanguageDropdown({
  value,
  onChange,
  hasError,
}: {
  value: string;
  onChange: (value: string) => void;
  hasError: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedLabel = LANGUAGES.find((l) => l.value === value)?.label ?? 'Select a language';

  const filtered = useMemo(
    () =>
      search
        ? LANGUAGES.filter((l) => l.label.toLowerCase().includes(search.toLowerCase()))
        : LANGUAGES,
    [search]
  );

  return (
    <>
      <Pressable
        onPress={() => {
          setOpen(true);
          setSearch('');
        }}
        style={[styles.dropdown, hasError && styles.dropdownError]}>
        <Text style={value ? styles.selectedTextStyle : styles.placeholderStyle}>
          {selectedLabel}
        </Text>
        <Text style={styles.chevron}>▼</Text>
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setOpen(false)}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            <TextInput
              placeholder="Search language..."
              value={search}
              onChangeText={setSearch}
              style={styles.searchInput}
              autoFocus
            />
            <FlatList
              data={[...filtered]}
              keyExtractor={(item) => item.value}
              style={styles.list}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.item, item.value === value && styles.itemSelected]}
                  onPress={() => {
                    onChange(item.value);
                    setOpen(false);
                  }}>
                  <Text style={[styles.itemText, item.value === value && styles.itemTextSelected]}>
                    {item.label}
                  </Text>
                  {item.value === value && <Text style={styles.checkmark}>✓</Text>}
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No languages found</Text>}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

// Extended schema with more fields
const signUpSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmedPassword: z.string(),
    username: z
      .string()
      .min(3, 'Username must be at least 3 characters')
      .max(20, 'Username too long'),
    first_name: z.string().min(1, 'First name is required'),
    last_name: z.string().min(1, 'Last name is required'),
    preferred_language: z.enum(languageValues as unknown as [string, ...string[]], {
      errorMap: () => ({ message: 'Please select a language' }),
    }),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    message: 'Passwords do not match',
    path: ['confirmedPassword'],
  });

type SignUpFields = z.infer<typeof signUpSchema>;

export default function SignUp() {
  const [input, setInput] = useState<SignUpFields>({
    email: '',
    password: '',
    confirmedPassword: '',
    username: '',
    first_name: '',
    last_name: '',
    preferred_language: 'en', // default value
  });

  const [errors, setErrors] = useState<Partial<Record<keyof SignUpFields, string>>>({});
  const [loading, setLoading] = useState(false);

  function handleInputChanged(field: keyof SignUpFields, value: string) {
    setInput((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field when user types
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit() {
    const result = signUpSchema.safeParse(input);

    if (!result.success) {
      const newErrors: Partial<Record<keyof SignUpFields, string>> = {};
      result.error.errors.forEach((err) => {
        const path = err.path[0] as keyof SignUpFields;
        newErrors[path] = err.message;
      });
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    const full_name = `${input.first_name} ${input.last_name}`.trim();

    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        data: {
          username: input.username,
          full_name,
          preferred_language: input.preferred_language,
        },
      },
    });

    if (error) {
      Alert.alert('Sign Up Error', error.message);
    } else if (!session) {
      Toast.show({
        type: 'info',
        text1: 'Verify Email',
        text2: 'Please check your inbox for verification!',
        visibilityTime: 3000,
        onHide: () => {
          // Optional: navigate when toast disappears
          router.replace('/(auth)/login');
        },
        // Or add a custom button inside toast (needs custom component)
      });
    }

    await setCurrentUserId();
    setLoading(false);
  }

  const hasError = (field: keyof SignUpFields) => !!errors[field];

  return (
    <KeyboardAwareScrollView
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      enableOnAndroid
      extraScrollHeight={24}
      extraHeight={120}>
      <View className="flex w-full items-center bg-white p-6 pt-10">
        <View style={styles.formCard}>
          <View className={`flex w-full self-start`}>
            <TextInput
              placeholder="User Name"
              value={input.username}
              onChangeText={(v) => handleInputChanged('username', v)}
              className={`mb-1 w-full self-start rounded-lg border px-4 py-3 ${hasError('username') ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
              autoCapitalize="none"
            />
            {hasError('username') && (
              <Text className="ml-1 py-2 text-sm text-red-600">{errors.username}</Text>
            )}
          </View>

          <View className={`flex flex-row self-start `}>
            {/* First Name */}
            <View>
              <TextInput
                placeholder="First Name"
                value={input.first_name}
                onChangeText={(v) => handleInputChanged('first_name', v)}
                className={`mb-1 mr-7 min-w-[130px] rounded-lg border px-4 py-3 ${hasError('first_name') ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
              />
              {hasError('first_name') && (
                <Text className="ml-1 py-2 text-sm text-red-600">{errors.first_name}</Text>
              )}
            </View>

            <View>
              {/* Last Name */}
              <TextInput
                placeholder="Last Name"
                value={input.last_name}
                onChangeText={(v) => handleInputChanged('last_name', v)}
                className={`mb-1  min-w-[130px]  rounded-lg border px-4 py-3 ${hasError('last_name') ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
              />
              {hasError('last_name') && (
                <Text className="ml-1  py-2 text-sm text-red-600">{errors.last_name}</Text>
              )}
            </View>
          </View>

          <View className={`w-full`}>
            {/* Email */}
            <TextInput
              placeholder="Email"
              value={input.email}
              onChangeText={(v) => handleInputChanged('email', v)}
              className={`mb-1 rounded-lg border px-4 py-3 ${hasError('email') ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {hasError('email') && (
              <Text className="ml-1  py-2  text-sm text-red-600">{errors.email}</Text>
            )}
          </View>

          <View className={`w-full`}>
            {/* Password */}
            <TextInput
              placeholder="Password"
              secureTextEntry
              value={input.password}
              onChangeText={(v) => handleInputChanged('password', v)}
              className={`mb-1 rounded-lg border px-4 py-3 ${hasError('password') ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
            />
            {hasError('password') && (
              <Text className="ml-1  py-2 text-sm text-red-600">{errors.password}</Text>
            )}
          </View>

          <View className={`w-full`}>
            {/* Confirm Password */}
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry
              value={input.confirmedPassword}
              onChangeText={(v) => handleInputChanged('confirmedPassword', v)}
              className={`mb-1 rounded-lg border px-4 py-3 ${hasError('confirmedPassword') ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'}`}
            />
            {hasError('confirmedPassword') && (
              <Text className="ml-1 py-2  text-sm text-red-600">{errors.confirmedPassword}</Text>
            )}
          </View>

          <View className={`w-full`}>
            {/* Language Selection */}
            <LanguageDropdown
              value={input.preferred_language}
              onChange={(v) => handleInputChanged('preferred_language', v)}
              hasError={hasError('preferred_language')}
            />
            {hasError('preferred_language') && (
              <Text className="ml-1 py-2 text-sm text-red-600">{errors.preferred_language}</Text>
            )}
          </View>

          {/* Submit Button */}
          <View className={`w-full`}>
            <TouchableOpacity
              style={[styles.signUpButton, loading && styles.signUpButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  formCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    gap: 12,
  },
  titleBox: {
    borderRadius: 12,
    overflow: 'hidden',
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  title: {
    width: '100%',
    textAlign: 'center',
    color: '#fff',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },

  image: {
    width: 80,
    height: 80,
    resizeMode: 'contain',

    // The key lines that turn it completely black
    tintColor: 'black', // forces entire image to black (works on PNG with transparency)
    opacity: 1.0, // keep full strength
  },
  dropdown: {
    height: 50,
    borderColor: '#d1d5db',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    marginBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#9ca3af',
  },
  selectedTextStyle: {
    fontSize: 14,
    color: '#111827',
  },
  chevron: {
    fontSize: 10,
    color: '#9ca3af',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    maxHeight: '60%',
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  searchInput: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingHorizontal: 16,
    fontSize: 14,
  },
  list: {
    maxHeight: 300,
  },
  item: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f3f4f6',
  },
  itemSelected: {
    backgroundColor: '#eefafc',
  },
  itemText: {
    fontSize: 15,
    color: '#111827',
  },
  itemTextSelected: {
    color: ACCENT_COLOR,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: ACCENT_COLOR,
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    paddingVertical: 20,
    color: '#9ca3af',
    fontSize: 14,
  },
  signUpButton: {
    backgroundColor: ACCENT_COLOR,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
