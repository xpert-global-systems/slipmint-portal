import '../styles/globals.css'
import ChatBubble from '../components/ChatBubble'
import Script from 'next/script'

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Script
        id="adsense"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7755614390195735"
        crossOrigin="anonymous"
      />

      <Component {...pageProps} />
      <ChatBubble />
    </>
  )
}
