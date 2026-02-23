import { FavoriteItem, toggleFavorite } from '@/states/global/redux-favoritesSlice';
import { RootState } from '@/states/global/redux-store';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

function FavoriteRow({ item }: { item: FavoriteItem }) {
  const dispatch = useDispatch();
  const discountedPrice = item.price * (1 - item.discount / 100);

  return (
    <View className="mx-3 my-2 flex-row overflow-hidden rounded-2xl bg-white">
      <Image source={{ uri: item.image }} className="h-28 w-28" resizeMode="contain" />

      <View className="flex-1 justify-between px-3 py-3">
        <View>
          <Text className="text-base font-bold capitalize text-gray-800">{item.name}</Text>
          <View className="mt-1 flex-row flex-wrap gap-1">
            {item.species?.map((s, i) => (
              <View key={i} className="rounded-full bg-yellow-400 px-2 py-0.5">
                <Text className="text-xs font-semibold capitalize text-white">{s}</Text>
              </View>
            ))}
          </View>
          <View className="mt-2 flex-row items-center gap-2">
            {item.discount > 0 && (
              <View className="rounded-full bg-red-500 px-2 py-0.5">
                <Text className="text-xs font-bold text-white">-{item.discount}%</Text>
              </View>
            )}
            <Text className="text-sm font-bold text-gray-900">${discountedPrice.toFixed(2)}</Text>
            {item.discount > 0 && (
              <Text className="text-xs text-gray-400 line-through">${item.price.toFixed(2)}</Text>
            )}
          </View>
        </View>

        {/* Stats row */}
        <View className="mt-2 flex-row gap-2">
          {[
            { label: 'HP', value: item.hp },
            { label: 'ATK', value: item.attack },
            { label: 'DEF', value: item.defense },
          ].map((s) => (
            <View key={s.label} className="items-center rounded-lg bg-slate-100 px-2 py-1">
              <Text className="text-xs text-gray-400">{s.label}</Text>
              <Text className="text-xs font-bold text-gray-700">{s.value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Unlike button */}
      <TouchableOpacity
        onPress={() => dispatch(toggleFavorite(item))}
        className="items-center justify-center px-3">
        <Ionicons name="heart" size={24} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}

export default function FavoritesScreen() {
  const items = useSelector((state: RootState) => state.favorites.items);

  return (
    <SafeAreaView className="flex-1 bg-blue-950">
      {/* Header */}
      <View className="px-4 py-3">
        <Text className="text-xl font-bold text-white">Favourites</Text>
        <Text className="text-sm text-blue-300">
          {items.length} pokemon{items.length !== 1 ? 's' : ''} liked
        </Text>
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Ionicons name="heart-outline" size={64} color="#93c5fd" />
          <Text className="text-lg font-semibold text-blue-300">No favourites yet</Text>
          <Text className="text-sm text-blue-400">
            Tap the heart on any Pokémon to save it here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <FavoriteRow item={item} />}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
      )}
    </SafeAreaView>
  );
}
