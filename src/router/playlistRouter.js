import MyPlaylistsView from '@/views/playlist/MyPlaylistsView.vue';
import PlaylistDetailView from '@/views/playlist/PlaylistDetailView.vue';

const playlistRoutes = [
  {
    path: '/my-playlists',
    name: 'my-playlists',
    component: MyPlaylistsView
  },
  {
    path: '/playlist/:id',
    name: 'playlist-detail',
    component: PlaylistDetailView
  }
];

export default playlistRoutes;
