import Config from 'react-native-config'

export const DeepLinks = {
  prefix: Config.DEEP_LINK_PREFIX,
  AddByRSSPodcastFeedUrl: {
    path: 'podcast-by-feed-url/add*',
    pathPrefix: 'podcast-by-feed-url',
    pathWithId: (id: string) => `podcast-by-feed-url/${id}`
  },
  Clip: {
    path: 'clip/:mediaRefId',
    pathPrefix: 'clip',
    pathWithId: (id: string) => `clip/${id}`
  },
  Episode: {
    path: 'episode/:episodeId',
    pathPrefix: 'episode',
    pathWithId: (id: string) => `episode/${id}`
  },
  Playlist: {
    path: 'playlist/:playlistId',
    pathPrefix: 'playlist',
    pathWithId: (id: string) => `playlist/${id}`
  },
  Playlists: {
    path: 'playlists'
  },
  Podcast: {
    path: 'podcast/:podcastId',
    pathPrefix: 'podcast',
    pathWithId: (id: string) => `podcast/${id}`
  },
  Podcasts: {
    path: 'podcasts'
  },
  Profile: {
    path: 'profile/:userId',
    pathPrefix: 'profile',
    pathWithId: (id: string) => `profile/${id}`
  },
  Profiles: {
    path: 'profiles'
  },
  Search: {
    path: 'search'
  }
}
