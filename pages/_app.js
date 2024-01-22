import "@/styles/globals.css";
import { AnimationProvider } from "@/utils/animation";
import useTimeout from "@/utils/useTimeout";
import { useRouter } from "next/router";
import NextNProgress from 'nextjs-progressbar';
import { useEffect } from "react";
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  
  return (
    <>
      <Toaster />
      <AnimationProvider>
        <NextNProgress height={"6px"} />
        <Component {...pageProps} />
      </AnimationProvider>
    </>
  );
}
