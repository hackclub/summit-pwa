import "@/styles/globals.css";
import { AnimationProvider } from "@/utils/animation";
import useTimeout from "@/utils/useTimeout";
import { useRouter } from "next/router";
import NextNProgress from 'nextjs-progressbar';
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  // const router = useRouter();

  // useEffect(() => {
  //   router.events.on('routeChangeStart', routeChangeStart);
  //   router.events.on('routeChangeComplete', routeChangeEnd);
  //   router.events.on('routeChangeError', routeChangeError);
  //   return () => {
  //     router.events.off('routeChangeStart', routeChangeStart);
  //     router.events.off('routeChangeComplete', routeChangeEnd);
  //     router.events.off('routeChangeError', routeChangeError);
  //   };
  // }, []);

  return (
    <>
      <AnimationProvider>
        <NextNProgress height={"6px"} />
        <Component {...pageProps} />
      </AnimationProvider>
    </>
  );
}
