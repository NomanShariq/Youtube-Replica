import React, { useState, useRef } from 'react';
import {
  View, Text, Image, FlatList, ScrollView, TouchableOpacity,
  StyleSheet, Platform, ViewToken,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import YoutubePlayer from 'react-native-youtube-iframe';

type VideoItem = {
  type: 'video';
  id: string;
  title: string;
  channel: string;
  views: string;
  time: string;
  videoId: string;
  avatar: string;
};

type Short = { id: string; title: string; views: string; thumb: string };

type ShortsItem = { type: 'shorts'; id: string; shorts: Short[] };

type PostItem = {
  type: 'post';
  id: string;
  channel: string;
  avatar: string;
  time: string;
  text: string;
  image: string;
  likes: string;
  comments: string;
};

type FeedItem = VideoItem | ShortsItem | PostItem;

const CATEGORIES = ['All', 'Science', 'Animation', 'Motivation', 'Short Films', 'Technology', 'Live'];

const FEED: FeedItem[] = [
  {
    type: 'video',
    id: 'v1',
    title: 'The Egg - A Short Story',
    channel: 'Kurzgesagt – In a Nutshell',
    views: '45M views',
    time: '7 years ago',
    videoId: 'h6fcK_fRYaI',
    avatar: 'https://i.pravatar.cc/100?img=12',
  },
  {
    type: 'shorts',
    id: 's1',
    shorts: [
      { id: 'a', title: 'That one old uncle in your society', views: '2.1M views', thumb: 'https://picsum.photos/seed/short1/400/700' },
      { id: 'b', title: 'When the exam paper is easy', views: '860K views', thumb: 'https://picsum.photos/seed/short2/400/700' },
      { id: 'c', title: 'Street food tour in one minute', views: '1.4M views', thumb: 'https://picsum.photos/seed/short3/400/700' },
      { id: 'd', title: 'Football skills you must try', views: '3.3M views', thumb: 'https://picsum.photos/seed/short4/400/700' },
    ],
  },
  {
    type: 'video',
    id: 'v2',
    title: 'Big Buck Bunny (Official Blender Short Film)',
    channel: 'Blender',
    views: '12M views',
    time: '8 years ago',
    videoId: 'aqz-KE-bpKQ',
    avatar: 'https://i.pravatar.cc/100?img=5',
  },
  {
    type: 'post',
    id: 'p1',
    channel: 'Real Madrid',
    avatar: 'https://i.pravatar.cc/100?img=33',
    time: '5 hours ago',
    text: 'NEXT MATCH | PRÓXIMO PARTIDO\nRacing de Santander',
    image: 'https://picsum.photos/seed/nextmatch/900/1100',
    likes: '20K',
    comments: '87',
  },
  {
    type: 'video',
    id: 'v3',
    title: "Steve Jobs' 2005 Stanford Commencement Address",
    channel: 'Stanford',
    views: '40M views',
    time: '15 years ago',
    videoId: 'UF8uR6Z6KLc',
    avatar: 'https://i.pravatar.cc/100?img=8',
  },
  {
    type: 'video',
    id: 'v4',
    title: 'Sintel - Open Movie by Blender Foundation',
    channel: 'Blender',
    views: '9M views',
    time: '10 years ago',
    videoId: 'eRsGyueVLvQ',
    avatar: 'https://i.pravatar.cc/100?img=15',
  },
  {
    type: 'video',
    id: 'v5',
    title: 'Tears of Steel - Blender Open Movie',
    channel: 'Blender',
    views: '3M views',
    time: '9 years ago',
    videoId: 'R6MlUcmOul8',
    avatar: 'https://i.pravatar.cc/100?img=20',
  },
];

const Header = () => (
  <View style={s.header}>
    <View style={s.logoRow}>
      <View style={s.logoBox}>
        <Ionicons name="play" size={12} color="#fff" />
      </View>
      <Text style={s.logoText}>YouTube</Text>
    </View>
    <View style={s.headerRight}>
      <View style={s.bellWrap}>
        <Ionicons name="notifications-outline" size={27} color="#fff" />
        <View style={s.badge}>
          <Text style={s.badgeText}>9+</Text>
        </View>
      </View>
      <Ionicons name="search" size={26} color="#fff" style={{ marginLeft: 22 }} />
    </View>
  </View>
);

const Chips = () => {
  const [active, setActive] = useState('All');
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={s.chips}
      contentContainerStyle={s.chipsContent}
    >
      <View style={s.compass}>
        <Ionicons name="compass-outline" size={22} color="#fff" />
      </View>
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

const VideoCard = ({ item, isActive, width }: { item: VideoItem; isActive: boolean; width: number }) => {
  const [muted, setMuted] = useState(true);
  const height = (width * 9) / 16;
  const src = `https://www.youtube.com/embed/${item.videoId}?autoplay=${isActive ? 1 : 0}&mute=${muted ? 1 : 0}&loop=1&playlist=${item.videoId}&controls=0`;

  return (
    <View style={s.card}>
      <View style={{ width, height, backgroundColor: '#222' }}>
        {Platform.OS === 'web' ? (
          React.createElement('iframe', {
            width,
            height,
            src,
            style: { border: 'none' },
            allow: 'autoplay; encrypted-media',
          })
        ) : (
          <YoutubePlayer
            height={height}
            width={width}
            videoId={item.videoId}
            play={isActive}
            mute={muted}
            initialPlayerParams={{ loop: true, playlist: item.videoId, controls: false }}
          />
        )}
        <TouchableOpacity style={s.muteBtn} onPress={() => setMuted(!muted)}>
          <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={s.info}>
        <Image source={{ uri: item.avatar }} style={s.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={s.title} numberOfLines={2}>{item.title}</Text>
          <Text style={s.meta} numberOfLines={1}>
            {item.channel} · {item.views} · {item.time}
          </Text>
        </View>
        <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
      </View>
    </View>
  );
};

const ShortsShelf = ({ item, width }: { item: ShortsItem; width: number }) => {
  const cardW = width * 0.46;
  const cardH = cardW * 1.75;
  return (
    <View style={s.shelf}>
      <View style={s.shelfHead}>
        <View style={s.shortsLogo}>
          <Ionicons name="play" size={14} color="#fff" />
        </View>
        <Text style={s.shelfTitle}>Shorts</Text>
        <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 12 }}
      >
        {item.shorts.map((sh) => (
          <View key={sh.id} style={{ width: cardW, marginRight: 8 }}>
            <Image source={{ uri: sh.thumb }} style={{ width: cardW, height: cardH, borderRadius: 12, backgroundColor: '#222' }} />
            <View style={s.shortOverlay}>
              <Text style={s.shortTitle} numberOfLines={2}>{sh.title}</Text>
              <Text style={s.shortViews}>{sh.views}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const Post = ({ item, width }: { item: PostItem; width: number }) => (
  <View style={s.post}>
    <View style={s.postHead}>
      <Image source={{ uri: item.avatar }} style={s.postAvatar} />
      <View style={{ flex: 1 }}>
        <Text style={s.postName}>{item.channel}</Text>
        <Text style={s.postTime}>{item.time}</Text>
      </View>
      <Ionicons name="ellipsis-vertical" size={20} color="#fff" />
    </View>
    <Text style={s.postText}>{item.text}</Text>
    <Image source={{ uri: item.image }} style={{ width, height: width * 1.2, backgroundColor: '#222' }} />
    <View style={s.postActions}>
      <View style={s.action}>
        <Ionicons name="thumbs-up-outline" size={24} color="#fff" />
        <Text style={s.actionText}>{item.likes}</Text>
      </View>
      <View style={s.action}>
        <Ionicons name="thumbs-down-outline" size={24} color="#fff" />
      </View>
      <View style={{ flex: 1 }} />
      <View style={s.action}>
        <Ionicons name="arrow-redo-outline" size={24} color="#fff" />
      </View>
      <View style={s.action}>
        <Ionicons name="bookmark-outline" size={24} color="#fff" />
      </View>
      <View style={s.action}>
        <Ionicons name="chatbubble-outline" size={22} color="#fff" />
        <Text style={s.actionText}>{item.comments}</Text>
      </View>
    </View>
  </View>
);

const BottomBar = () => (
  <View style={s.bottomBar}>
    <TouchableOpacity style={s.tab}>
      <Ionicons name="home" size={25} color="#fff" />
      <Text style={s.tabText}>Home</Text>
    </TouchableOpacity>
    <TouchableOpacity style={s.tab}>
      <Ionicons name="flash-outline" size={25} color="#fff" />
      <Text style={s.tabText}>Shorts</Text>
    </TouchableOpacity>
    <TouchableOpacity style={s.tab}>
      <View style={s.plus}>
        <Ionicons name="add" size={30} color="#fff" />
      </View>
    </TouchableOpacity>
    <TouchableOpacity style={s.tab}>
      <View>
        <Ionicons name="albums-outline" size={25} color="#fff" />
        <View style={s.redDot} />
      </View>
      <Text style={s.tabText}>Subscriptions</Text>
    </TouchableOpacity>
    <TouchableOpacity style={s.tab}>
      <Image source={{ uri: 'https://i.pravatar.cc/100?img=15' }} style={s.youPhoto} />
      <Text style={s.tabText}>You</Text>
    </TouchableOpacity>
  </View>
);

export default function App() {
  const [activeId, setActiveId] = useState('v1');
  const [boxW, setBoxW] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const first = viewableItems.find((v) => (v.item as FeedItem).type === 'video');
    if (first) setActiveId((first.item as FeedItem).id);
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  const renderItem = ({ item }: { item: FeedItem }) => {
    if (boxW === 0) return null;
    if (item.type === 'video') {
      return <VideoCard item={item} isActive={item.id === activeId} width={boxW} />;
    }
    if (item.type === 'shorts') {
      return <ShortsShelf item={item} width={boxW} />;
    }
    return <Post item={item} width={boxW} />;
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <StatusBar style="light" />
        <View style={s.page} onLayout={(e) => setBoxW(e.nativeEvent.layout.width)}>
          <Header />
          <FlatList<FeedItem>
            data={FEED}
            keyExtractor={(i) => i.id}
            extraData={`${activeId}-${boxW}`}
            renderItem={renderItem}
            ListHeaderComponent={<Chips />}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            showsVerticalScrollIndicator={false}
          />
          <BottomBar />
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F0F' },
  page: { flex: 1, width: '100%', maxWidth: 480, alignSelf: 'center' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center' },
  logoBox: {
    width: 30,
    height: 21,
    borderRadius: 6,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: { color: '#fff', fontSize: 21, fontWeight: '700', letterSpacing: -1.2, marginLeft: 4 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  bellWrap: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -5,
    right: -9,
    backgroundColor: '#CC0000',
    borderRadius: 9,
    paddingHorizontal: 5,
    minWidth: 20,
    alignItems: 'center',
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  chips: { marginBottom: 8 },
  chipsContent: { paddingHorizontal: 12, alignItems: 'center' },
  compass: {
    backgroundColor: '#272727',
    width: 40,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
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

  card: { marginBottom: 18 },
  muteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(60,60,60,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flexDirection: 'row', paddingHorizontal: 12, paddingTop: 12, alignItems: 'flex-start' },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 12, backgroundColor: '#333' },
  title: { color: '#fff', fontSize: 14, fontWeight: '500', lineHeight: 19 },
  meta: { color: '#AAAAAA', fontSize: 12, marginTop: 3 },

  shelf: { marginBottom: 18 },
  shelfHead: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, marginBottom: 12 },
  shortsLogo: {
    width: 26,
    height: 26,
    borderRadius: 7,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shelfTitle: { flex: 1, color: '#fff', fontSize: 19, fontWeight: '700', marginLeft: 12 },
  shortOverlay: { position: 'absolute', left: 10, right: 10, bottom: 10 },
  shortTitle: { color: '#fff', fontSize: 14, fontWeight: '600' },
  shortViews: { color: '#e0e0e0', fontSize: 12, marginTop: 2 },

  post: { marginBottom: 18 },
  postHead: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 12 },
  postAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12, backgroundColor: '#333' },
  postName: { color: '#fff', fontSize: 15, fontWeight: '600' },
  postTime: { color: '#AAAAAA', fontSize: 13, marginTop: 2 },
  postText: { color: '#fff', fontSize: 15, lineHeight: 21, paddingHorizontal: 12, paddingBottom: 10 },
  postActions: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingTop: 12 },
  action: { flexDirection: 'row', alignItems: 'center', marginRight: 22 },
  actionText: { color: '#fff', fontSize: 14, marginLeft: 8 },

  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F0F0F',
    borderTopWidth: 0.5,
    borderTopColor: '#2a2a2a',
    paddingVertical: 8,
  },
  tab: { flex: 1, alignItems: 'center' },
  tabText: { color: '#fff', fontSize: 10, marginTop: 3 },
  plus: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#272727',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redDot: {
    position: 'absolute',
    top: -1,
    right: -3,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#FF0000',
  },
  youPhoto: { width: 25, height: 25, borderRadius: 13, backgroundColor: '#333' },
});