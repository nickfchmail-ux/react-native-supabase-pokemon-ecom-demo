import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { MotiView } from 'moti';
import React, { memo, useCallback, useState } from 'react';
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

// ── Memoized Fade In Component ─────────────────────────────────────
const FadeSlideIn = memo(
  ({
    children,
    fromY = 40,
    delay = 0,
  }: {
    children: React.ReactNode;
    fromY?: number;
    delay?: number;
  }) => (
    <MotiView
      from={{ opacity: 0, translateY: fromY }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 600, delay }}>
      {children}
    </MotiView>
  )
);

// ── Memoized Light Sweep Card ─────────────────────────────────────
const LightSweepCard = memo(
  ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 60, scale: 0.92 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay }}
      style={{ overflow: 'hidden', borderRadius: 24 }}>
      {children}
      <MotiView
        from={{ translateX: -200 }}
        animate={{ translateX: 500 }}
        transition={{ duration: 800, delay: delay + 300 }}
        style={styles.lightSweep}>
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.35)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </MotiView>
    </MotiView>
  )
);

// ── Main Screen ───────────────────────────────────────────────────
export default function ServiceIntroduction() {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback((event: any) => {
    setScrollY(event.nativeEvent.contentOffset.y);
  }, []);

  return (
    <>
      <StatusBar style="light" />

      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32} // Reduced from 16
        onScroll={handleScroll}
        removeClippedSubviews={true} // Big performance win
        windowSize={5} // Only render 5 screens worth
      >
        {/* Hero */}
        <ImageBackground
          source={{
            uri: 'https://wallpapers.com/images/hd/colorful-abstract-clouds-desktop-axob5r3sbaullmrk.jpg',
          }}
          className="h-[640px] items-center justify-center"
          resizeMode="cover">
          <View className="absolute inset-0 bg-black/50" />

          <FadeSlideIn fromY={-60} delay={100}>
            <Image
              source={require('../../../assets/images/pokemon_logo.png')}
              style={{ width: 280, height: 100 }}
              contentFit="contain"
            />
          </FadeSlideIn>

          <FadeSlideIn fromY={30} delay={300}>
            <Text className="mt-6 text-center text-5xl font-bold tracking-tight text-white">
              Welcome to Pokémon World
            </Text>
          </FadeSlideIn>

          <FadeSlideIn fromY={20} delay={500}>
            <Text className="mt-6 max-w-[280px] text-center text-xl text-white/90">
              Authentic plush toys, figures, and collectibles from the official Pokémon Center.
            </Text>
          </FadeSlideIn>

          <FadeSlideIn fromY={40} delay={700}>
            <Pressable
              onPress={() => router.push('/shop')}
              className="mt-12 rounded-full bg-blue-600 px-16 py-5 active:bg-blue-700">
              <Text className="text-2xl font-bold text-white">Shop Now</Text>
            </Pressable>
          </FadeSlideIn>
        </ImageBackground>

        {/* Our Story */}
        <View className="bg-white px-6 py-20">
          <LightSweepCard delay={100}>
            <View className="rounded-3xl border border-gray-100 bg-white p-10 shadow-xl">
              <Text className="mb-4 text-center text-4xl font-bold">Our Story</Text>
              <Text className="text-center text-lg leading-relaxed text-gray-600">
                Born from a love of Pokémon, we curate genuine plush dolls and figures for fans
                everywhere.
              </Text>
            </View>
          </LightSweepCard>
        </View>

        {/* Mission */}
        <View className="bg-slate-50 px-6 py-20">
          <FadeSlideIn delay={100}>
            <Text className="mb-12 text-center text-4xl font-bold">Our Mission</Text>
          </FadeSlideIn>

          <View className="flex-row flex-wrap justify-center gap-6">
            {[
              { icon: '✨', title: 'Quality', desc: '100% official items' },
              { icon: '🤝', title: 'Community', desc: 'Connecting fans' },
              { icon: '💛', title: 'Service', desc: 'Passionate help' },
            ].map((item, i) => (
              <LightSweepCard key={i} delay={i * 80}>
                <View className="w-[155px] items-center rounded-3xl bg-white p-7 shadow-md">
                  <Text className="mb-3 text-4xl">{item.icon}</Text>
                  <Text className="text-xl font-bold text-blue-600">{item.title}</Text>
                  <Text className="mt-1 text-center text-sm text-gray-500">{item.desc}</Text>
                </View>
              </LightSweepCard>
            ))}
          </View>
        </View>

        {/* Featured Collectibles */}
        <View className="px-6 py-20">
          <FadeSlideIn delay={100}>
            <Text className="mb-10 text-center text-4xl font-bold">Featured Collectibles</Text>
          </FadeSlideIn>

          <View className="flex-row flex-wrap justify-between gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <LightSweepCard key={i} delay={i * 60}>
                <View className="aspect-square w-[47%] overflow-hidden rounded-3xl shadow-xl">
                  <Image
                    source={{ uri: `https://picsum.photos/id/${100 + i}/600/600` }}
                    className="h-full w-full"
                    contentFit="cover"
                    recyclingKey={`img-${i}`}
                  />
                </View>
              </LightSweepCard>
            ))}
          </View>
        </View>

        {/* Final CTA */}
        <View className="items-center bg-blue-600 px-6 py-24">
          <FadeSlideIn delay={100}>
            <Text className="mb-4 text-center text-4xl font-bold text-white">
              Start Your Collection
            </Text>
          </FadeSlideIn>
          <FadeSlideIn delay={200}>
            <Text className="mb-12 text-center text-xl text-blue-100">
              Authentic pieces that bring Pokémon magic to life.
            </Text>
          </FadeSlideIn>
          <FadeSlideIn delay={300}>
            <Pressable
              onPress={() => router.push('/shop')}
              className="rounded-full bg-yellow-400 px-16 py-6 active:bg-yellow-300">
              <Text className="text-2xl font-bold text-gray-900">Shop Now</Text>
            </Pressable>
          </FadeSlideIn>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  lightSweep: {
    position: 'absolute',
    top: 0,
    left: -100,
    bottom: 0,
    width: 120,
    transform: [{ skewX: '-25deg' }],
  },
});
