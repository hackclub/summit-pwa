import $ from "@/utils/animation";
import Head from "next/head";
import { Akaya_Kanadaka, UnifrakturCook } from "next/font/google";
import Link from "next/link";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { currentUser } from "@/lib/sessions";
import { getCookie } from "cookies-next";
const akaya = Akaya_Kanadaka({ weight: "400", subsets: ["latin"] });
const cook = UnifrakturCook({ weight: "700", subsets: ["latin"] });

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter()

  useEffect(() => {
    window.api = api;
  }, []);

  return (
    <main
      {...$[akaya.className]({
        width: "100vw",
        height: "100vh",
        padding: "0px",
        margin: "0px",
        display: "flex",
        flexDirection: "row"
      })}
    >
      <Head>
        <title>Welcome – Hack Club Leaders Summit</title>
      </Head>
      <div
        {...$({
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          width: "min(40vw, 600px)",
          background: "var(--tan)",
          color: "var(--red)",
          padding: "24px"
        })}
      >
        <div>
          <h1
            {...$({
              marginBottom: "16px",
              animate$fadeIn: {
                duration: "0.5s",
                delay: "0s",
                args: ["fromBottom"]
              }
            })}
          >
            Welcome!
          </h1>

          <p
            {...$({
              marginBottom: "24px",
              animate$fadeIn: {
                duration: "0.5s",
                delay: "0.5s",
                args: ["fromBottom"]
              }
            })}
          >
            Sign in to access your ticket, view the event schedule, select
            workshops, and more!
          </p>

          <div
            {...$({
              width: "min(100%, 400px)",
              gap: "12px",
              display: "flex",
              flexDirection: "column",
              animate$fadeIn: {
                duration: "0.5s",
                delay: "1s",
                args: ["fromBottom"]
              }
            })}
          >
            <div
              {...$({
                textDecoration: "none",
                color: "var(--tan)",
                background: "var(--red)",
                width: "100%",
                display: "flex",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "row",
                width: "100%"
              })}
            >
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                .inputFocus:focus {
                  outline: none;
                  background: white!important;
                  color: black!important;
                  transition: 0.1s;
                }
                .inputFocus:focus::placeholder {
                  color: black;
                  opacity: 0.5;
                }
                .inputFocus::placeholder {
                  color: var(--red);
                  opacity: 0.7;
                }
              `
                }}
              />
              <input
                {...$[akaya.className].inputFocus({
                  padding: "8px",
                  fontSize: "24px",
                  flexGrow: "1",
                  border: "2px solid var(--red)",
                  background: "var(--tan)",
                  color: "var(--red)",
                  borderRadius: "8px",
                  outlineColor: "white",
                  outlineWidth: "2px"
                })}
                placeholder="Email"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
              />
              <a
                href="/login"
                {...$({ textDecoration: "none", cursor: loading ? "default" : "pointer" })}
                onClick={async (e) => {
                  if(loading) return;
                  e.preventDefault();
                  setLoading(true);
                  const { registered } = await api.auth.sessions.begin.post({
                    email
                  });
                  if (!registered) router.push("/login/register");
                  else router.push("/login");
                }}
              >
                <h2
                  {...$({
                    fontFamily: "system-ui",
                    padding: "8px",
                    textDecoration: "none",
                    color: "var(--tan)",
                    fontSize: loading ? "1.8rem" : "2rem",
                    display: 'flex',
                    alignItems: 'center'
                  })}
                >
                  {loading ? "⌛" : "→"}
                </h2>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div
        {...$({
          border: "6px solid var(--tan)",
          flexGrow: "1",
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "center",
          height: "100vh",
          background: `url("https://cloud-7ppjvjso3-hack-club-bot.vercel.app/0frame.svg")`,
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain"
        })}
      >
        <div
          {...$({
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "min(35vh, 310px)",
            gap: "30px"
          })}
        >
          <img
            {...$({
              maxWidth: "min(30vw, 180px)",
              animate$fadeIn: {
                args: ["fromBottom"],
                delay: "0.5s"
              }
            })}
            src="https://cloud-fn8ydpafc-hack-club-bot.vercel.app/0flag-standalone-bw__2__1.svg"
          />
          <h1
            {...$[cook.className]({
              animate$fadeIn: {
                args: ["fromBottom"],
                delay: "1s"
              }
            })}
          >
            Leaders Summit
          </h1>
        </div>
      </div>
    </main>
  );
}

export const getServerSideProps = async ({req, res}) => {
  const sessionId = getCookie('session', { req, res });
  const user = await currentUser(sessionId);
  if (user) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    }
  }
  return {
    props: {},
  }
}
