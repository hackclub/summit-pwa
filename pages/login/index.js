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

const akaya = Akaya_Kanadaka({ weight: "400", subsets: ["latin"] });
const cook = UnifrakturCook({ weight: "700", subsets: ["latin"] });
const space = Space_Mono({ weight: "400", subsets: ["latin"] });

export default function LoginPage() {
  const [loginCode, setLoginCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const login = async () => {
    if (loading) return;
    setLoading(true);

    const { authorized, ticketGenerated } = await api.auth.sessions.authorize.post({
      loginCode
    });

    if (!authorized) {
      setLoading(false);
      setLoginCode("");
      return alert("🧙‍♀️ What sort of witchcraft is this? That's an invalid login code!");
    }

    if (!ticketGenerated) {
      console.log(await api.attendee.generateTicket.get());
    }

    router.push("/dashboard");
  }

  return (
    <Login pageName="Login" limitedAnimations={true}>
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
        Great!
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
        We sent a login code to your email. It expires in 15 minutes. Didn't get it? <Link href="/" {...$({
          textDecoration: "underline",
          color: "var(--red)"
        })}>Try again.</Link>
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
                .inputFocus {
                  font-family: ${space.style.fontFamily};
                }
                .inputFocus:focus {
                  outline: none;
                  background: white!important;
                  color: black!important;
                  transition: 0.1s;
                }
                .inputFocus:placeholder-shown {
                  font-family: ${akaya.style.fontFamily};
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
          <span className={space.className} style={{ display: 'none' }}>Login</span> {/* font loader */}
          <input
            {...$.inputFocus({
              padding: "8px",
              fontSize: "24px",
              flexGrow: "1",
              border: "2px solid var(--red)",
              background: "var(--tan)",
              color: "var(--red)",
              borderRadius: "8px",
              outlineColor: "white",
              outlineWidth: "2px",
              height: "56px",
              minWidth: "0px"
            })}
            autoComplete="off"
            spellCheck="false"
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            placeholder="Login Code"
            value={loginCode}
            disabled={loading}
            onChange={(e) => setLoginCode(e.target.value.toUpperCase().split("").filter(e => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('').includes(e)).join("").substring(0, 6))}
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
    </Login>
  );
}

export const getServerSideProps = async ({req, res}) => {
  const session = await Session.from(req, res);

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
