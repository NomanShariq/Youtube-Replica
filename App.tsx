import React, { useState, useRef } from 'react';
import {
  View, Text, Image, FlatList, ScrollView, TouchableOpacity,
  StyleSheet, useWindowDimensions, Platform,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

type Video = {
  id: string;
  title: string;
  channel: string;
  views: string;
  time: string;
  duration: string;
  videoId: string;
  avatar: string;
  music?: boolean;
};

type Tab = { name: string; icon: IoniconName };

type ViewableItemsInfo = {
  viewableItems: { item: Video; isViewable: boolean }[];
};

const CATEGORIES: string[] = [
  'All', 'Science', 'Animation', 'Motivation', 'Short Films', 'Technology', 'Live',
];
const VIDEOS: Video[] = [
  {
    id: '1',
    title: 'The Egg - A Short Story',
    channel: 'Kurzgesagt – In a Nutshell',
    views: '45M views',
    time: '7 years ago',
    duration: '8:06',
    videoId: 'h6fcK_fRYaI',
    avatar: 'https://i.pravatar.cc/100?img=12',
  },
  {
    id: '2',
    title: 'Big Buck Bunny (Official Blender Short Film)',
    channel: 'Blender',
    views: '12M views',
    time: '8 years ago',
    duration: '10:34',
    videoId: 'aqz-KE-bpKQ',
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
  {
    id: '3',
    title: "Steve Jobs' 2005 Stanford Commencement Address",
    channel: 'Stanford',
    views: '40M views',
    time: '15 years ago',
    duration: '15:04',
    videoId: 'UF8uR6Z6KLc',
    avatar: 'https://i.pravatar.cc/100?img=8',
  },
  {
    id: '4',
    title: 'Sintel - Open Movie by Blender Foundation',
    channel: 'Blender',
    views: '9M views',
    time: '10 years ago',
    duration: '14:48',
    videoId: 'eRsGyueVLvQ',
    avatar: 'https://i.pravatar.cc/100?img=15',
  },
  {
    id: '5',
    title: 'Tears of Steel - Blender Open Movie',
    channel: 'Blender',
    views: '3M views',
    time: '9 years ago',
    duration: '12:14',
    videoId: 'R6MlUcmOul8',
    avatar: 'https://i.pravatar.cc/100?img=20',
  },
];

const TABS: Tab[] = [
  { name: 'Home', icon: 'home' },
  { name: 'Shorts', icon: 'flash-outline' },
  { name: 'Create', icon: 'add-circle-outline' },
  { name: 'Subscriptions', icon: 'albums-outline' },
  { name: 'You', icon: 'person-circle-outline' },
];

const Header = () => (
  <View style={s.header}>
    <View style={s.headerLeft}>
      <Ionicons name="menu" size={26} color="#fff" />
      <Ionicons name="logo-youtube" size={32} color="#FF0000" style={{ marginLeft: 18 }} />
      <Text style={s.logoText}>YouTube</Text>
      <Text style={s.logoCountry}>PK</Text>
    </View>
    <View style={s.headerRight}>
      <Ionicons name="search" size={24} color="#fff" style={s.hIcon} />
      <Ionicons name="cloud-upload-outline" size={24} color="#fff" style={s.hIcon} />
      <Image source={{ uri: 'https://i.pravatar.cc/100?img=15' }} style={s.profile} />
    </View>
  </View>
);

const Chips = () => {
  const [active, setActive] = useState<string>('All');
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={s.chips}
      contentContainerStyle={{ paddingHorizontal: 12 }}
    >
      {CATEGORIES.map((c) => (
        <TouchableOpacity
          key={c}
          onPress={() => setActive(c)}
          style={[s.chip, active === c && s.chipActive]}
        >
          <Text style={[s.chipText, active === c && s.chipTextActive]}>{c}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const VideoCard = ({ item, isActive }: { item: Video; isActive: boolean }) => {
  const { width } = useWindowDimensions();
  const playerWidth = width - 24;
  const playerHeight = (playerWidth * 9) / 16;

  return (
    <View style={s.card}>
      <View style={[s.playerWrap, { width: playerWidth, height: playerHeight }]}>
        {Platform.OS === 'web' ? (
          // @ts-ignore
          <iframe
            width={playerWidth}
            height={playerHeight}
            src={`https://www.youtube.com/embed/${item.videoId}?autoplay=${isActive ? 1 : 0}&mute=1&loop=1&playlist=${item.videoId}&controls=0`}
            style={{ border: 'none' }}
            allow="autoplay; encrypted-media"
          />
        ) : (
          <YoutubePlayer
            height={playerHeight}
            width={playerWidth}
            videoId={item.videoId}
            play={isActive}
            mute={true}
            initialPlayerParams={{ loop: true, playlist: item.videoId, controls: false }}
          />
        )}
        <View style={s.durationBox} pointerEvents="none">
          {item.music && (
            <Ionicons name="musical-notes" size={11} color="#fff" style={{ marginRight: 3 }} />
          )}
          <Text style={s.durationText}>{item.duration}</Text>
        </View>
      </View>

      <View style={s.info}>
        <Image source={{ uri: item.avatar }} style={s.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={s.title} numberOfLines={2}>{item.title}</Text>
          <View style={s.metaRow}>
            <Text style={s.meta}>{item.channel} </Text>
            <Ionicons name="checkmark-circle" size={12} color="#AAAAAA" />
            <Text style={s.meta}> · {item.views} · {item.time}</Text>
          </View>
        </View>
        <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
      </View>
    </View>
  );
};

const BottomBar = () => (
  <View style={s.bottomBar}>
    {TABS.map((t) => (
      <TouchableOpacity key={t.name} style={s.tab}>
        <Ionicons name={t.icon} size={24} color="#fff" />
        <Text style={s.tabText}>{t.name}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function App() {
  const [activeId, setActiveId] = useState<string>('1');

  const onViewableItemsChanged = useRef(({ viewableItems }: ViewableItemsInfo) => {
    if (viewableItems.length > 0) {
      setActiveId(viewableItems[0].item.id);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <StatusBar style="light" />
        <Header />
        <FlatList<Video>
          data={VIDEOS}
          keyExtractor={(i) => i.id}
          extraData={activeId}
          renderItem={({ item }) => (
            <VideoCard item={item} isActive={item.id === activeId} />
          )}
          ListHeaderComponent={<Chips />}
          onViewableItemsChanged={onViewableItemsChanged as any}
          viewabilityConfig={viewabilityConfig}
          showsVerticalScrollIndicator={false}
        />
        <BottomBar />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  logoText: { color: '#fff', fontSize: 19, fontWeight: '700', letterSpacing: -1, marginLeft: 3 },
  logoCountry: { color: '#AAAAAA', fontSize: 9, marginLeft: 2, marginTop: -8 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  hIcon: { marginLeft: 20 },
  profile: { width: 30, height: 30, borderRadius: 15, marginLeft: 20, backgroundColor: '#333' },

  chips: { marginVertical: 8 },
  chip: {
    backgroundColor: '#272727',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  chipActive: { backgroundColor: '#fff' },
  chipText: { color: '#fff', fontSize: 13, fontWeight: '500' },
  chipTextActive: { color: '#000' },

  card: { marginBottom: 20 },
  playerWrap: {
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#222',
  },
  durationBox: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  info: { flexDirection: 'row', paddingHorizontal: 12, paddingTop: 12, alignItems: 'flex-start' },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12, backgroundColor: '#333' },
  title: { color: '#fff', fontSize: 14, fontWeight: '500', lineHeight: 19 },
  metaRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginTop: 3 },
  meta: { color: '#AAAAAA', fontSize: 12 },

  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    borderTopWidth: 0.5,
    borderTopColor: '#2a2a2a',
    paddingVertical: 8,
  },
  tab: { alignItems: 'center' },
  tabText: { color: '#fff', fontSize: 10, marginTop: 2 },
});