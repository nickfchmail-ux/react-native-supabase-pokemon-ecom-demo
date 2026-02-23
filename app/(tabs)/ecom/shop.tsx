import PokemonCard from '@/components/ui/PokemonCard';
import { useAuth } from '@/hooks/useAuth';
import { getPokemons } from '@/lib/data-service';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function TabTwoScreen() {
  const { session } = useAuth();
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null);

  const {
    data: pokemonsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pokemons'],
    queryFn: () => getPokemons(),
  });

  const allSpecies = useMemo(() => {
    if (!pokemonsData) return [];
    const set = new Set<string>();
    pokemonsData.forEach((p) => p.species?.forEach((s: string) => set.add(s)));

    return Array.from(set).sort();
  }, [pokemonsData]);

  const filteredPokemons = useMemo(() => {
    if (!pokemonsData) return [];
    if (!selectedSpecies) return pokemonsData;
    return pokemonsData.filter((p) => p.species?.includes(selectedSpecies));
  }, [pokemonsData, selectedSpecies]);

  if (isLoading) return <ActivityIndicator className="flex-1 items-center justify-center" />;
  if (error) return <Text>{error.message}</Text>;

  return (
    <View className="flex-1 bg-blue-950">
      {/* Filter bar */}
      <View className="px-3 pt-3">
        <View className="mb-2 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-blue-200">Filter by species</Text>
          <Text className="text-sm font-bold text-yellow-400">
            {filteredPokemons.length} results
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="pb-2">
          {/* All chip */}
          <TouchableOpacity
            onPress={() => setSelectedSpecies(null)}
            className={`mr-2 rounded-full px-4 py-1.5 ${
              selectedSpecies === null ? 'bg-yellow-400' : 'bg-blue-800'
            }`}>
            <Text
              className={`text-sm font-semibold capitalize ${
                selectedSpecies === null ? 'text-blue-950' : 'text-blue-200'
              }`}>
              All
            </Text>
          </TouchableOpacity>
          {allSpecies.map((species) => (
            <TouchableOpacity
              key={species}
              onPress={() => setSelectedSpecies(species === selectedSpecies ? null : species)}
              className={`mr-2 rounded-full px-4 py-1.5 ${
                selectedSpecies === species ? 'bg-yellow-400' : 'bg-blue-800'
              }`}>
              <Text
                className={`text-sm font-semibold capitalize ${
                  selectedSpecies === species ? 'text-blue-950' : 'text-blue-200'
                }`}>
                {species}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Pokemon list */}
      <FlatList
        data={filteredPokemons}
        renderItem={({ item }) => (
          <PokemonCard
            id={item.id?.toString()}
            name={item.name}
            species={item.species}
            descriptions={item.descriptions}
            hp={item.hp}
            attack={item.attack}
            defense={item.defense}
            special_attack={item.special_attack}
            special_defense={item.special_defense}
            image={item.image}
            price={item.pokemons_selling?.regular_price ?? 0}
            discount={item.pokemons_selling?.discount ?? 0}
          />
        )}
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
