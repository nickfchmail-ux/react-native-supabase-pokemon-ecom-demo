import { FlatList, Pressable, Text } from 'react-native';

interface CategoryListProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

export default function CategoryList({ categories, selected, onSelect }: CategoryListProps) {
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={categories}
      keyExtractor={(item) => item}
      contentContainerClassName="px-4 gap-2 py-4"
      renderItem={({ item }) => {
        const isSelected = selected === item;
        return (
          <Pressable
            onPress={() => onSelect(item)}
            className={`rounded-full border px-4 py-2 ${
              isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300 bg-white'
            } active:opacity-80`}>
            <Text className={`font-semibold ${isSelected ? 'text-white' : 'text-gray-700'}`}>
              {item}
            </Text>
          </Pressable>
        );
      }}
    />
  );
}
