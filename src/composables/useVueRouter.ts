import { useRoute, useRouter, onBeforeRouteUpdate, onBeforeRouteLeave } from 'vue-router'

export default function useVueRouter() {
  const route = useRoute()
  const router = useRouter()

  return {
    route,
    router,
    onBeforeRouteUpdate,
    onBeforeRouteLeave
  }
}
