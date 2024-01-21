import '@/styles/globals.css'
import { AnimationProvider } from '@/utils/animation'

export default function App({ Component, pageProps }) {
  return <>
    <AnimationProvider>
      <Component {...pageProps} />
    </AnimationProvider>
</>
}
