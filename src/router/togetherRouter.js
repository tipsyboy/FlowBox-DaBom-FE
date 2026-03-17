import TogetherMainView from '@/views/together/TogetherMainView.vue'
import TogetherSearchView from '@/views/together/TogetherSearchView.vue'
import TogetherRoomView from '@/views/together/TogetherRoomView.vue'

const togetherRoutes = [
  {
    path: '/together',
    name: 'together',
    component: TogetherMainView
  },
  {
    path: '/together/search',
    name: 'togetherSearch',
    component: TogetherSearchView
  },
  {
    path: '/together/:id',
    name: 'togetherRoom',
    component: TogetherRoomView
  }
]

export default togetherRoutes
