import {
  addToCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '@/states/global/redux-cartSlice';
import { toggleFavorite } from '@/states/global/redux-favoritesSlice';
import { RootState } from '@/states/global/redux-store';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const SPECIES_ICONS: Record<string, any> = {
  bug: require('@/assets/images/bug.png'),
  dark: require('@/assets/images/dark.png'),
  dragon: require('@/assets/images/dragon.png'),
  electric: require('@/assets/images/electric.png'),
  fairy: require('@/assets/images/fairy.png'),
  fighting: require('@/assets/images/fighting.png'),
  fire: require('@/assets/images/fire.png'),
  flying: require('@/assets/images/flying.png'),
  ghost: require('@/assets/images/ghost.png'),
  grass: require('@/assets/images/grass.png'),
  ground: require('@/assets/images/ground.png'),
  ice: require('@/assets/images/ice.png'),
  normal: require('@/assets/images/normal.png'),
  poison: require('@/assets/images/poison.png'),
  psychic: require('@/assets/images/psychic.png'),
  rock: require('@/assets/images/rock.png'),
  steel: require('@/assets/images/steel.png'),
  water: require('@/assets/images/water.png'),
};

type PokemonCardProps = {
  id: string;
  name: string;
  species: string[];
  descriptions: string[];
  hp: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  image: string;
  price: number;
  discount: number;
};

export default function PokemonCard(Props: PokemonCardProps) {
  const dispatch = useDispatch();
  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((i) => i.id === Props.id)
  );
  const isFavorite = useSelector((state: RootState) =>
    state.favorites.items.some((i) => i.id === Props.id)
  );
  const quantity = cartItem?.quantity ?? 0;
  const discountedPrice = Props.price * (1 - Props.discount / 100);

  const stats = [
    { label: 'HP', value: Props.hp, color: 'bg-green-400' },
    { label: 'ATK', value: Props.attack, color: 'bg-red-400' },
    { label: 'DEF', value: Props.defense, color: 'bg-blue-400' },
    { label: 'SP.ATK', value: Props.special_attack, color: 'bg-purple-400' },
    { label: 'SP.DEF', value: Props.special_defense, color: 'bg-yellow-400' },
  ];

  return (
    <View className="mx-3 my-2 overflow-hidden rounded-2xl bg-white shadow-md">
      {/* Header */}
      <View className="items-center bg-slate-100 pb-2 pt-4">
        {/* Heart button */}
        <TouchableOpacity
          onPress={() =>
            dispatch(
              toggleFavorite({
                id: Props.id,
                name: Props.name,
                image: Props.image,
                species: Props.species,
                descriptions: Props.descriptions,
                hp: Props.hp,
                attack: Props.attack,
                defense: Props.defense,
                special_attack: Props.special_attack,
                special_defense: Props.special_defense,
                price: Props.price,
                discount: Props.discount,
              })
            )
          }
          className="absolute right-3 top-3 z-10">
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={26}
            color={isFavorite ? '#ef4444' : '#9ca3af'}
          />
        </TouchableOpacity>
        <Image source={{ uri: Props.image }} className="h-28 w-28" resizeMode="contain" />
        <Text className="mt-1 min-w-[100px] text-center text-xl font-bold capitalize text-gray-800">
          {Props.name.trim()}
        </Text>
        {/* Species tags */}
        <View className="mt-1 flex-row flex-wrap justify-center gap-1 px-2">
          {Props.species?.map((s, i) => (
            <View key={i} className="">
              {SPECIES_ICONS[s.toLowerCase()] && (
                <Image
                  source={SPECIES_ICONS[s.toLowerCase()]}
                  className="h-[20px] w-[80px]"
                  resizeMode="contain"
                />
              )}
            </View>
          ))}
        </View>
      </View>

      {/* Stats */}
      <View className="px-4 py-3">
        {stats.map((stat) => (
          <View key={stat.label} className="mb-1.5 flex-row items-center gap-2">
            <Text className="w-16 text-xs font-semibold text-gray-500">{stat.label}</Text>
            <View className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200">
              <View
                className={`h-full rounded-full ${stat.color}`}
                style={{ width: `${Math.min((stat.value / 150) * 100, 100)}%` }}
              />
            </View>
            <Text className="w-8 text-right text-xs font-bold text-gray-700">{stat.value}</Text>
          </View>
        ))}
      </View>

      {/* Description */}
      {Props.descriptions?.[0] && (
        <View className="border-t border-gray-100 px-4 pt-2">
          <Text className="text-xs leading-4 text-gray-500" numberOfLines={2}>
            {Props.descriptions[0]}
          </Text>
        </View>
      )}

      {/* Price */}
      <View className="flex-row items-center justify-between gap-2 px-4 pt-3">
        <View className={`flex flex-row gap-3`}>
          {Props.discount > 0 && (
            <Text className="text-sm text-gray-400 line-through">${Props.price.toFixed(2)}</Text>
          )}
          {Props.discount > 0 && (
            <View className="rounded-full bg-red-500 px-2 py-0.5">
              <Text className="text-xs font-bold text-white">-{Props.discount}%</Text>
            </View>
          )}
        </View>
        <Text className="text-lg font-bold text-gray-900">${discountedPrice.toFixed(2)}</Text>
      </View>

      {/* Cart Controls */}
      <View className="flex-row items-center justify-between border-t border-gray-100 px-4 py-3">
        {quantity === 0 ? (
          <TouchableOpacity
            onPress={() =>
              dispatch(
                addToCart({
                  id: Props.id,
                  name: Props.name,
                  image: Props.image,
                  species: Props.species,
                  descriptions: Props.descriptions,
                  hp: Props.hp,
                  attack: Props.attack,
                  defense: Props.defense,
                  special_attack: Props.special_attack,
                  special_defense: Props.special_defense,
                  price: Props.price,
                  discount: Props.discount,
                })
              )
            }
            className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-yellow-400 py-2">
            <Ionicons name="cart-outline" size={18} color="white" />
            <Text className="font-bold text-white">Add to Cart</Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-1 flex-row items-center justify-between">
            <TouchableOpacity
              onPress={() => dispatch(removeFromCart(Props.id))}
              className="rounded-xl bg-red-100 p-2">
              <Ionicons name="trash-outline" size={18} color="#ef4444" />
            </TouchableOpacity>
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                onPress={() => dispatch(decreaseQuantity(Props.id))}
                className="h-8 w-8 items-center justify-center rounded-full bg-gray-200">
                <Ionicons name="remove" size={18} color="#374151" />
              </TouchableOpacity>
              <Text className="w-6 text-center text-base font-bold text-gray-800">{quantity}</Text>
              <TouchableOpacity
                onPress={() => dispatch(increaseQuantity(Props.id))}
                className="h-8 w-8 items-center justify-center rounded-full bg-yellow-400">
                <Ionicons name="add" size={18} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}
