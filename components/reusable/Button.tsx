import { Pressable, Text, View } from 'react-native';

type ButtonProps = {
  title: string;
  onPress: () => void;
};

export default function Button({ title, onPress }: ButtonProps) {
  return (
    <View className="m-2">
      <Pressable
        onPress={onPress}
        className="rounded-lg bg-blue-500 px-4 py-2 active:bg-white active:opacity-70">
        <Text className="font-bold text-white">{title}</Text>
      </Pressable>
    </View>
  );
}
