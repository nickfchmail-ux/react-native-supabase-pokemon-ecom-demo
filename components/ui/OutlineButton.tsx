import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';

type OutlineButtonProps = {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  children: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
};

export default function OutlineButton({
  onPress,
  icon,
  children,
  disabled = false,
  style,
}: OutlineButtonProps) {
  return (
    <Pressable
      className={`flex flex-row items-center rounded-full border border-amber-500 px-6 py-3`}
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}>
      <Ionicons
        name={icon}
        size={18}
        color={disabled ? '#fff2e6' : '#D2691E'}
        style={styles.icon}
      />
      <Text style={[styles.text, disabled && styles.textDisabled]}>{children}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressed: {
    backgroundColor: 'rgba(255, 235, 205, 0.12)', // very light peach tint on press
    opacity: 0.85,
  },
  disabled: {
    borderColor: '#666',
    opacity: 0.55,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#D2691E',
    letterSpacing: 0.3,
  },
  textDisabled: {
    color: '#fff2e6',
  },
});
