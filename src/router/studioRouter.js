import StudioLayoutView from '@/views/studio/StudioLayoutView.vue'
import StudioVideoManagementView from '@/views/studio/StudioVideoManagementView.vue'
import StudioCommunityManagementView from '@/views/studio/StudioCommunityManagementView.vue'
import StudioInfoEditView from '@/views/studio/StudioInfoEditView.vue'

const studioRoutes = [
  {
    path: '/mychannel',
    component: StudioLayoutView,
    redirect: '/mychannel/videos',
    children: [
      {
        path: '',
        redirect: '/mychannel/videos'
      },
      {
        path: 'videos',
        name: 'studioVideos',
        component: StudioVideoManagementView
      },
      {
        path: 'community',
        name: 'studioCommunity',
        component: StudioCommunityManagementView
      },
      {
        path: 'info',
        name: 'studioInfo',
        component: StudioInfoEditView
      }
    ]
  }
]

export default studioRoutes
