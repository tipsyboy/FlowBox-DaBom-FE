import Video_Player from '../views/Video_Player.vue'

const videoPlayerRoutes = [
    {
        path: '/video-player/:id',
        name: 'videoPlayer',
        component: Video_Player,
    },
]

export default videoPlayerRoutes
