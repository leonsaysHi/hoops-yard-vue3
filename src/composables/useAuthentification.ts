import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth'
import { useAuth } from '@vueuse/firebase/useAuth'
import { auth, admins, teams } from '@/firebase'
import { computed } from 'vue'
export default function useAuthentification() {
  
  const { user } = useAuth(auth)
  const isAdmin = computed<boolean>(
    () => typeof user.value?.email === 'string' && admins.includes(user.value?.email)
  )
  const isTeam = computed<boolean>(
    () => typeof user?.value?.email === 'string' && teams.includes(user.value?.email)
  )
  const userAccess = computed(() => isAdmin.value ? 'admin' : isTeam.value ? 'team' : undefined)
  const isLogged = computed(() => isAdmin.value || isTeam.value)
  const logIn = () => signInWithPopup(auth, new GoogleAuthProvider())
    .catch((reason) => {
      console.error('Failed signin with popup', reason)
    })
    
  const logOut = () => signOut(auth)
  return {
    logIn,
    logOut,
    userAccess,
    isLogged,
    isTeam,
    isAdmin
  }
}
