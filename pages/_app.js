import '../styles/globals.css'
import ChatBubble from '../components/ChatBubble'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <ChatBubble />
    </>
  )
}
