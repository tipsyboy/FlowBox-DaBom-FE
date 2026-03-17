import VideoPlayer from '../views/VideoPlayer.vue'

const videoPlayerRoutes = [
    {
        path: '/video-player/:id',
        name: 'videoPlayer',
        component: VideoPlayer,
    },
]

export default videoPlayerRoutes
