import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, Image, FlatList, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, Platform, Share, BackHandler,
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
  handle: string;
  views: string;
  likes: string;
  time: string;
  tag: string;
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

type Comment = { id: string; user: string; text: string };

type ViewableInfo = {
  viewableItems: { item: any; isViewable: boolean }[];
};

const MY_AVATAR = 'https://i.pravatar.cc/100?img=15';

const CATEGORIES = ['All', 'Science', 'Animation', 'Motivation', 'Short Films', 'Technology', 'Live'];

const START_COMMENTS: Comment[] = [
  { id: 'c1', user: '@hamza_dev', text: 'Ye video dekh kar maza aa gaya, bohot acha laga' },
  { id: 'c2', user: '@sara.k', text: 'Mujhe iska end sab se zyada pasand aaya' },
];

const FEED: FeedItem[] = [
  {
    type: 'video',
    id: 'v1',
    title: 'The Egg - A Short Story',
    channel: 'Kurzgesagt – In a Nutshell',
    handle: '@kurzgesagt',
    views: '45M views',
    likes: '1.4M likes',
    time: '7y ago',
    tag: '#TheEgg',
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
    handle: '@BlenderOfficial',
    views: '12M views',
    likes: '98K likes',
    time: '8y ago',
    tag: '#Blender',
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
    handle: '@stanford',
    views: '40M views',
    likes: '620K likes',
    time: '15y ago',
    tag: '#Stanford',
    videoId: 'UF8uR6Z6KLc',
    avatar: 'https://i.pravatar.cc/100?img=8',
  },
  {
    type: 'video',
    id: 'v4',
    title: 'Sintel - Open Movie by Blender Foundation',
    channel: 'Blender',
    handle: '@BlenderOfficial',
    views: '9M views',
    likes: '75K likes',
    time: '10y ago',
    tag: '#Sintel',
    videoId: 'eRsGyueVLvQ',
    avatar: 'https://i.pravatar.cc/100?img=15',
  },
  {
    type: 'video',
    id: 'v5',
    title: 'Tears of Steel - Blender Open Movie',
    channel: 'Blender',
    handle: '@BlenderOfficial',
    views: '3M views',
    likes: '31K likes',
    time: '9y ago',
    tag: '#TearsOfSteel',
    videoId: 'R6MlUcmOul8',
    avatar: 'https://i.pravatar.cc/100?img=20',
  },
];

const isVideo = (i: FeedItem): i is VideoItem => i.type === 'video';

const ALL_VIDEOS = FEED.filter(isVideo);

const thumbUrl = (videoId: string) => `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

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

const VideoCard = ({
  item, isActive, width, onOpen,
}: { item: VideoItem; isActive: boolean; width: number; onOpen: () => void }) => {
  const [muted, setMuted] = useState(true);
  const height = (width * 9) / 16;
  const src = `https://www.youtube.com/embed/${item.videoId}?autoplay=1&mute=${muted ? 1 : 0}&loop=1&playlist=${item.videoId}&controls=0`;

  return (
    <View style={s.card}>
      <View style={{ width, height, backgroundColor: '#222' }}>
        {isActive ? (
          Platform.OS === 'web' ? (
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
              play
              mute={muted}
              initialPlayerParams={{ loop: true, playlist: item.videoId, controls: false }}
            />
          )
        ) : (
          <Image
            source={{ uri: thumbUrl(item.videoId) }}
            style={{ width, height }}
            resizeMode="cover"
          />
        )}
        <TouchableOpacity activeOpacity={1} onPress={onOpen} style={StyleSheet.absoluteFill} />
        {isActive && (
          <TouchableOpacity style={s.muteBtn} onPress={() => setMuted(!muted)}>
            <Ionicons name={muted ? 'volume-mute' : 'volume-high'} size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity activeOpacity={0.8} onPress={onOpen} style={s.info}>
        <Image source={{ uri: item.avatar }} style={s.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={s.title} numberOfLines={2}>{item.title}</Text>
          <Text style={s.meta} numberOfLines={1}>
            {item.channel} · {item.views} · {item.time}
          </Text>
        </View>
        <Ionicons name="ellipsis-vertical" size={18} color="#fff" />
      </TouchableOpacity>
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
            <Image
              source={{ uri: sh.thumb }}
              style={{ width: cardW, height: cardH, borderRadius: 12, backgroundColor: '#222' }}
            />
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
      <Image source={{ uri: MY_AVATAR }} style={s.youPhoto} />
      <Text style={s.tabText}>You</Text>
    </TouchableOpacity>
  </View>
);

const Player = ({ videoId, width, height }: { videoId: string; width: number; height: number }) => {
  if (Platform.OS === 'web') {
    return React.createElement('iframe', {
      width,
      height,
      src: `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&playsinline=1`,
      style: { border: 'none' },
      allow: 'autoplay; encrypted-media; fullscreen',
    });
  }
  return (
    <YoutubePlayer
      height={height}
      width={width}
      videoId={videoId}
      play
      webViewProps={{ allowsInlineMediaPlayback: true }}
    />
  );
};

const Suggested = ({ item, width, onPress }: { item: VideoItem; width: number; onPress: () => void }) => (
  <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={s.card}>
    <Image
      source={{ uri: thumbUrl(item.videoId) }}
      style={{ width, height: (width * 9) / 16, backgroundColor: '#222' }}
      resizeMode="cover"
    />
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
  </TouchableOpacity>
);

const WatchBody = ({
  video, others, width, onOpen,
}: {
  video: VideoItem;
  others: VideoItem[];
  width: number;
  onOpen: (v: VideoItem) => void;
}) => {
  const [expanded, setExpanded] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [comments, setComments] = useState<Comment[]>(START_COMMENTS);
  const [draft, setDraft] = useState('');

  const playerH = (width * 9) / 16;

  const toggleLike = () => {
    setLiked(!liked);
    setDisliked(false);
  };

  const toggleDislike = () => {
    setDisliked(!disliked);
    setLiked(false);
  };

  const shareVideo = () => {
    Share.share({ message: `https://www.youtube.com/watch?v=${video.videoId}` }).catch(() => {});
  };

  const postComment = () => {
    const text = draft.trim();
    if (!text) return;
    setComments([{ id: String(Date.now()), user: 'You', text }, ...comments]);
    setDraft('');
  };

  return (
    <View style={[StyleSheet.absoluteFill, { paddingTop: playerH, backgroundColor: '#0F0F0F' }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
        <TouchableOpacity activeOpacity={0.9} onPress={() => setExpanded(!expanded)} style={s.watchInfo}>
          <Text style={s.watchTitle} numberOfLines={expanded ? undefined : 1}>
            {video.title}
          </Text>
          <Text style={s.watchMeta} numberOfLines={expanded ? undefined : 1}>
            {video.handle}  {video.likes}  {video.views}  {video.time}  {video.tag}
            <Text style={s.more}>{expanded ? '  show less' : '  more'}</Text>
          </Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.actionRow}
        >
          <Image source={{ uri: video.avatar }} style={s.watchAvatar} />
          <TouchableOpacity
            onPress={() => setSubscribed(!subscribed)}
            style={[s.subBtn, subscribed && s.subBtnOn]}
          >
            <Text style={[s.subText, subscribed && s.subTextOn]}>
              {subscribed ? 'Subscribed' : 'Subscribe'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleLike} style={s.watchIcon}>
            <Ionicons name={liked ? 'thumbs-up' : 'thumbs-up-outline'} size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDislike} style={s.watchIcon}>
            <Ionicons name={disliked ? 'thumbs-down' : 'thumbs-down-outline'} size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareVideo} style={s.watchIcon}>
            <Ionicons name="arrow-redo-outline" size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={s.watchIcon}>
            <Ionicons name="sparkles-outline" size={26} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={s.watchIcon}>
            <Ionicons name="ellipsis-horizontal" size={26} color="#fff" />
          </TouchableOpacity>
        </ScrollView>

        <View style={s.commentCard}>
          <View style={s.commentHead}>
            <Text style={s.commentTitle}>
              Comments <Text style={s.commentCount}>{comments.length}</Text>
            </Text>
            <View style={s.dots}>
              <View style={s.dotLong} />
              <View style={s.dot} />
              <View style={s.dot} />
            </View>
          </View>

          {comments.length > 0 && (
            <View style={s.topComment}>
              <Text style={s.topCommentText} numberOfLines={2}>
                <Text style={s.topCommentUser}>{comments[0].user}  </Text>
                {comments[0].text}
              </Text>
            </View>
          )}

          <View style={s.inputRow}>
            <Image source={{ uri: MY_AVATAR }} style={s.inputAvatar} />
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={postComment}
              placeholder="Comment..."
              placeholderTextColor="#9a9a9a"
              returnKeyType="send"
              style={[s.input, Platform.OS === 'web' && ({ outlineStyle: 'none' } as any)]}
            />
          </View>
        </View>

        <View style={{ marginTop: 18 }}>
          {others.map((v) => (
            <Suggested key={v.id} item={v} width={width} onPress={() => onOpen(v)} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default function App() {
  const [activeId, setActiveId] = useState('v1');
  const [boxW, setBoxW] = useState(0);
  const [current, setCurrent] = useState<VideoItem | null>(null);
  const [mini, setMini] = useState(false);

  const full = !!current && !mini;

  const onViewableItemsChanged = useRef(({ viewableItems }: ViewableInfo) => {
    const first = viewableItems.find((v) => (v.item as FeedItem).type === 'video');
    if (first) setActiveId((first.item as FeedItem).id);
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 60 }).current;

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (current && !mini) {
        setMini(true);
        return true;
      }
      return false;
    });
    return () => sub.remove();
  }, [current, mini]);

  const openVideo = (v: VideoItem) => {
    setCurrent(v);
    setMini(false);
  };

  const closeVideo = () => {
    setCurrent(null);
    setMini(false);
  };

  const renderItem = ({ item }: { item: FeedItem }) => {
    if (boxW === 0) return null;
    if (item.type === 'video') {
      return (
        <VideoCard
          item={item}
          isActive={!current && item.id === activeId}
          width={boxW}
          onOpen={() => openVideo(item)}
        />
      );
    }
    if (item.type === 'shorts') {
      return <ShortsShelf item={item} width={boxW} />;
    }
    return <Post item={item} width={boxW} />;
  };

  const fullH = (boxW * 9) / 16;
  const miniW = Math.min(200, boxW * 0.5);
  const miniH = (miniW * 9) / 16;

  return (
    <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <StatusBar style="light" />
        <View style={s.page} onLayout={(e) => setBoxW(e.nativeEvent.layout.width)}>
          <View style={{ flex: 1, display: full ? 'none' : 'flex' }}>
            <Header />
            <FlatList<FeedItem>
              data={FEED}
              keyExtractor={(i) => i.id}
              extraData={`${activeId}-${boxW}-${current ? current.id : 0}`}
              renderItem={renderItem}
              ListHeaderComponent={<Chips />}
              onViewableItemsChanged={onViewableItemsChanged as any}
              viewabilityConfig={viewabilityConfig}
              showsVerticalScrollIndicator={false}
            />
            <BottomBar />
          </View>

          {full && current && boxW > 0 && (
            <WatchBody
              key={current.id}
              video={current}
              others={ALL_VIDEOS.filter((v) => v.id !== current.id)}
              width={boxW}
              onOpen={openVideo}
            />
          )}

          {current && boxW > 0 && (
            <View
              style={[
                mini ? s.mini : s.fullPlayer,
                mini ? { width: miniW, height: miniH } : { width: boxW, height: fullH },
              ]}
            >
              <Player
                key={current.videoId}
                videoId={current.videoId}
                width={mini ? miniW : boxW}
                height={mini ? miniH : fullH}
              />
              {mini ? (
                <>
                  <TouchableOpacity
                    activeOpacity={1}
                    style={StyleSheet.absoluteFill}
                    onPress={() => setMini(false)}
                  />
                  <TouchableOpacity style={s.miniClose} onPress={closeVideo}>
                    <Ionicons name="close" size={16} color="#fff" />
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={s.backBtn} onPress={() => setMini(true)}>
                  <Ionicons name="chevron-down" size={22} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
          )}
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

  fullPlayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 20,
    backgroundColor: '#000',
  },
  mini: {
    position: 'absolute',
    right: 12,
    bottom: 76,
    zIndex: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#000',
    elevation: 10,
  },
  miniClose: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtn: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  watchInfo: { paddingHorizontal: 14, paddingTop: 14 },
  watchTitle: { color: '#fff', fontSize: 18, fontWeight: '600', lineHeight: 24 },
  watchMeta: { color: '#AAAAAA', fontSize: 13, marginTop: 6, lineHeight: 18 },
  more: { color: '#fff', fontWeight: '600' },

  actionRow: { paddingHorizontal: 14, paddingVertical: 16, alignItems: 'center' },
  watchAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#333' },
  subBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 14,
  },
  subBtnOn: { backgroundColor: '#272727' },
  subText: { color: '#000', fontSize: 14, fontWeight: '600' },
  subTextOn: { color: '#fff' },
  watchIcon: { marginLeft: 26 },

  commentCard: {
    backgroundColor: '#272727',
    borderRadius: 14,
    marginHorizontal: 12,
    padding: 14,
  },
  commentHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  commentTitle: { color: '#fff', fontSize: 15, fontWeight: '600' },
  commentCount: { color: '#AAAAAA', fontWeight: '400' },
  dots: { flexDirection: 'row', alignItems: 'center' },
  dotLong: { width: 18, height: 7, borderRadius: 4, backgroundColor: '#fff', marginRight: 5 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#666', marginRight: 5 },
  topComment: { marginTop: 12 },
  topCommentUser: { color: '#fff', fontWeight: '600' },
  topCommentText: { color: '#DDDDDD', fontSize: 13, lineHeight: 18 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  inputAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#333' },
  input: {
    flex: 1,
    height: 38,
    marginLeft: 12,
    paddingHorizontal: 16,
    borderRadius: 19,
    backgroundColor: '#3a3a3a',
    color: '#fff',
    fontSize: 14,
  },
});