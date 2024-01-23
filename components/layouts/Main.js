import $ from "@/utils/animation";
import Head from "next/head";
import { Akaya_Kanadaka, UnifrakturCook } from "next/font/google";
import useBreakpoints from "@/utils/useBreakpoints";
import Link from "next/link"
import api from "@/lib/api";
import { useRouter } from "next/router";

const akaya = Akaya_Kanadaka({ weight: "400", subsets: ["latin"] });
const cook = UnifrakturCook({ weight: "700", subsets: ["latin"] });

export default function Login({ pageName, children, limitedAnimations = false, red = false }) {
  const router = useRouter();
  return (
    <div
      {...$[akaya.className]({
        width: "100vw",
        padding: "0px",
        margin: "0px",
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      })}
    >
      <Head>
        <title>{pageName} – Hack Club Leaders Summit</title>
      </Head>
      <style>{`#nprogress .bar {
        top: 50px!important;
      }`}</style>
      <nav {...$[akaya.className]({
        display: 'flex',
        height: '56px',
        background: 'var(--red)',
        padding: '8px 24px',
        alignItems: 'center',
        gap: '16px',
        borderBottom: "6px solid var(--tan)"
      })}> 
        <img
          {...$({
            height: '32px'
          })}
          src="https://cloud-fn8ydpafc-hack-club-bot.vercel.app/0flag-standalone-bw__2__1.svg"
        />
        <h2 {...$[cook.className]()}>
          Leaders Summit
        </h2>
        <div style={{flexGrow: 1}} /> 
        <Link href="/dashboard" style={{ textDecoration: 'none'}}>
          <h3 {...$({color: 'white', textDecoration: 'none'})}>
            Your Ticket
          </h3>
        </Link>
        <Link href="/schedule" style={{ textDecoration: 'none'}}>
          <h3 {...$({color: 'white', textDecoration: 'none'})}>
            Schedule
          </h3>
        </Link>
        <Link href="/photos" style={{ textDecoration: 'none'}}>
          <h3 {...$({color: 'white', textDecoration: 'none'})}>
            Photo & Video Album
          </h3>
        </Link>
        <a
          href="/"
          {...$({ color: 'white', textDecoration: 'none' })}
          onClick={async (e) => {
            e.preventDefault();
            await api.auth.sessions.destroy.post();
            router.push("/");
          }}
        >
          <h3 {...$({color: 'white', textDecoration: 'none'})}>
            Sign Out
          </h3>
        </a>
      </nav>
      <div {...$[akaya.className]({
        background: 'var(--tan)',
        flexGrow: 1,
        color: 'var(--red)',
        ...(red ? {
          background: 'var(--red)',
          color: 'var(--tan)',
        } : {})
      })}>
        <div style={{
          maxWidth: 'min(1000px, 100vw - 48px)',
          margin: '0 auto',
          paddingTop: '96px',
          paddingBottom: '24px',
          width: '100%',
        }}>
          {children}
        </div>
      </div>
    </div>
  );
}
