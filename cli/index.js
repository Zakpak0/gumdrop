import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {useSession} from "next-auth/react"
import {useRouter} from "next/router"
import { SessionProvider } from "next-auth/react"

export default function App({ Component, pageProps: {session, pageProps} }: AppProps) {
  const auth = Component?.auth
  if(auth){
    return(
      <Auth>
      <SessionProvider session={session}>
      <Component {...pageProps} />
      </SessionProvider>
      </Auth>
      )
  }else{
    return(
      <SessionProvider session={session}>
      <Component {...pageProps} />
      </SessionProvider>
      )
  }
}

function Auth({children}){
  const router = useRouter()
  const {data: session, status, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/signin")
    }
  })

  return(
    {children}
  )
}