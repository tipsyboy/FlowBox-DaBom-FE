import TogetherView from '@/views/together/TogetherView.vue'
import TogetherMainView from '@/views/together/subview/TogetherMainView.vue'
import TogetherRoom from '@/views/TogetherRoom.vue'

const togetherRoutes = [
  {
    path: '/together',
    name: 'together',
    component: TogetherView,
    children: [
      {
        path: '/together',
        name: 'togetherMain',
        component: TogetherMainView,
      },
      {
        path: '/together/search',
        name: 'togetherSearch',
        component: () => import('@/views/together/subview/TogetherSearchView.vue'),
      },
    ],
  },
  {
    path: '/together/:id',
    name: 'togetherRoom',
    component: TogetherRoom,
  },
]

export default togetherRoutes
