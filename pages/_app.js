import '../styles/globals.css'
import ChatBubble from '../components/ChatBubble'
import { Analytics } from '@vercel/analytics/next'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ChatBubble />
      <Analytics />
    </>
  )
}
