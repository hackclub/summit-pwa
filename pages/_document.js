import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/favicon.png" />
        <link rel="favicon" href="/favicon.png" />
        <link rel="shortcut icon" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/assets/apple.png" />
        <link rel="apple-touch-startup-image" href="/launch.png" />
      </Head>
      <body style={{ margin: "0px!important" }}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
