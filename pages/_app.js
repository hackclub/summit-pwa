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
      <NextNProgress height={8} color="var(--red)" transformCSS={css => {
        return <style>
          {css + `\n\n#nprogress .bar {
            box-shadow: none!important;
          }`}
        </style>;
      }} />
      <AnimationProvider>
        <Component {...pageProps} />
      </AnimationProvider>
    </>
  );
}
