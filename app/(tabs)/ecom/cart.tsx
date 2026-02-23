import {
  CartItem,
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '@/states/global/redux-cartSlice';
import { RootState } from '@/states/global/redux-store';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, FlatList, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
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

function CartRow({ item }: { item: CartItem }) {
  const dispatch = useDispatch();
  const discountedPrice = item.price * (1 - item.discount / 100);
  const rowTotal = discountedPrice * item.quantity;

  return (
    <View className="mx-3 my-2 flex-row overflow-hidden rounded-2xl bg-white">
      {/* Image */}
      <Image source={{ uri: item.image }} className="h-24 w-24" resizeMode="contain" />

      {/* Info */}
      <View className="flex-1 justify-between px-3 py-2">
        <View>
          <Text className="text-base font-bold capitalize text-gray-800">{item.name}</Text>
          <View className="mt-0.5 flex-row flex-wrap gap-1">
            {item.species?.map((s, i) => (
              <View key={i} className="">
                {SPECIES_ICONS[s.toLowerCase()] && (
                  <Image
                    source={SPECIES_ICONS[s.toLowerCase()]}
                    className="h-[12px] w-[50px]"
                    resizeMode="contain"
                  />
                )}
              </View>
            ))}
          </View>
          {/* Price */}
          <View className="mt-1 flex-row items-center gap-1.5">
            {item.discount > 0 && (
              <Text className="text-xs text-gray-400 line-through">${item.price.toFixed(2)}</Text>
            )}
            {item.discount > 0 && (
              <View className="rounded-full px-1.5 py-0.5">
                <Text className="text-xs font-bold text-red-600">-{item.discount}%</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quantity controls + row total */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => dispatch(decreaseQuantity(item.id))}
              className="h-7 w-7 items-center justify-center rounded-full bg-gray-200">
              <Ionicons name="remove" size={16} color="#374151" />
            </TouchableOpacity>
            <Text className="w-5 text-center font-bold text-gray-800">{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => dispatch(increaseQuantity(item.id))}
              className="h-7 w-7 items-center justify-center rounded-full bg-yellow-400">
              <Ionicons name="add" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-sm font-bold text-gray-700">${rowTotal.toFixed(2)}</Text>
        </View>
      </View>

      {/* Delete */}
      <TouchableOpacity
        onPress={() => dispatch(removeFromCart(item.id))}
        className="items-center justify-center px-3">
        <Ionicons name="trash-outline" size={20} color="#ef4444" />
      </TouchableOpacity>
    </View>
  );
}

export default function CartScreen() {
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) => state.cart.items);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalOriginal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const totalFinal = items.reduce(
    (sum, i) => sum + i.price * (1 - i.discount / 100) * i.quantity,
    0
  );
  const totalSavings = totalOriginal - totalFinal;

  function handleClearCart() {
    Alert.alert('Clear Cart', 'Remove all items from your cart?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Clear', style: 'destructive', onPress: () => dispatch(clearCart()) },
    ]);
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-950">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <View>
          <Text className="text-xl font-bold text-white">My Cart</Text>
          <Text className="text-sm text-blue-300">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </Text>
        </View>
        {items.length > 0 && (
          <TouchableOpacity
            onPress={handleClearCart}
            className="flex-row items-center gap-1 rounded-xl bg-red-500 px-3 py-1.5">
            <Ionicons name="trash-outline" size={14} color="white" />
            <Text className="text-sm font-semibold text-white">Clear all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Empty state */}
      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Ionicons name="cart-outline" size={64} color="#93c5fd" />
          <Text className="text-lg font-semibold text-blue-300">Your cart is empty</Text>
          <Text className="text-sm text-blue-400">Head to the shop to add some Pokémon!</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <CartRow item={item} />}
            contentContainerStyle={{ paddingBottom: 8 }}
          />

          {/* Checkout bar */}
          <View className="border-t border-blue-800 bg-blue-900 px-4 pb-6 pt-4">
            <View className="mb-1 flex-row justify-between">
              <Text className="text-sm text-blue-300">Original price</Text>
              <Text className="text-sm text-blue-300 line-through">
                ${totalOriginal.toFixed(2)}
              </Text>
            </View>
            <View className="mb-1 flex-row justify-between">
              <Text className="text-sm font-semibold text-green-400">You save</Text>
              <Text className="text-sm font-semibold text-green-400">
                -${totalSavings.toFixed(2)}
              </Text>
            </View>
            <View className="mb-4 mt-1 flex-row justify-between border-t border-blue-700 pt-2">
              <Text className="text-base font-bold text-white">Total</Text>
              <Text className="text-base font-bold text-yellow-400">${totalFinal.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              onPress={() => Alert.alert('Checkout', `Proceeding to pay $${totalFinal.toFixed(2)}`)}
              className="items-center rounded-2xl bg-yellow-400 py-3">
              <Text className="text-base font-bold text-blue-950">
                Checkout · ${totalFinal.toFixed(2)}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
