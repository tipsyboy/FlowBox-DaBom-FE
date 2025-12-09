
import SidebarContainer from "@/components/sidebar/SidebarContainer.vue"
import Login from "@/views/auth/Login.vue"
import Signup from "@/views/auth/Signup.vue"

const authRoutes = [
  {
    path: '/signup',
    name: 'signup',
    component: Signup,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },
  {
    path: "/tttttt",
    component: SidebarContainer
  }
]

export default authRoutes
