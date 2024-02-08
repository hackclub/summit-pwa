import $ from "@/utils/animation";
import Head from "next/head";
import { Akaya_Kanadaka, UnifrakturCook, Space_Mono } from "next/font/google";
import Link from "next/link";
import Login from "@/components/layouts/Login";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Session from "@/lib/sessions";
import { getCookie } from "cookies-next";
import Build from "@/components/Build";
const akaya = Akaya_Kanadaka({ weight: "400", subsets: ["latin"] });
const cook = UnifrakturCook({ weight: "700", subsets: ["latin"] });
const space = Space_Mono({ weight: "400", subsets: ["latin"] });
import { generateTicket } from "./api/attendee/generateTicket";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [admin, setAdmin] = useState(false);

  const login = async () => {
    try {
      if (loading) return;
      setLoading(true);
      const { registered } = await api.auth.sessions.begin.post({
        email,
        as: admin ? 'admin' : 'attendee'
      });
      if (!registered) router.push("/login/register");
      else router.push("/login"); 
    } catch (err) {
      console.error(err);
      alert("There was error logging in. Please report this error in #summit-app.");
    }
  }

  return (
    <Login pageName="Login" onFlagClick={() => setAdmin(true)}>
      <div style={{
        maxWidth: "100%"
      }}>
        <form onSubmit={e => e.preventDefault()}>
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

          <Build style={{
            position: 'absolute',
            bottom: '0px',
            right: '0px',
          }} />

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
                  outlineWidth: "2px",
                  minWidth: "0px"
                })}
                placeholder="Email"
                type="email"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") login();
                }}
              />
              <a
                href="/login"
                {...$({ textDecoration: "none", cursor: loading ? "default" : "pointer" })}
                onClick={async (e) => {
                  e.preventDefault();
                  await login();
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
        </form>
      </div>
    </Login>
  );
}

export const getServerSideProps = async ({req, res}) => {
  const session = await Session.from(req, res);
  const user = await session.currentAuthorizedUser();
  
  if(!user.fields.ticketing_ticketNumber) {
    await generateTicket()
  }

  if (session.authorized && await session.currentUser()) {
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
