import $ from "@/utils/animation";
import Head from "next/head";
import { Akaya_Kanadaka, UnifrakturCook, Space_Mono } from "next/font/google";
import Link from "next/link";
import Login from "@/components/layouts/Login";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const akaya = Akaya_Kanadaka({ weight: "400", subsets: ["latin"] });
const cook = UnifrakturCook({ weight: "700", subsets: ["latin"] });
const space = Space_Mono({ weight: "400", subsets: ["latin"] });

export default function LoginPage() {
  const [loginCode, setLoginCode] = useState("");
  const [loading, setLoading] = useState("");
  const router = useRouter();
  return (
    <Login pageName="Login">
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
        We sent you a login code, enter it below:
      </h1>
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
            })}
            placeholder="Login Code"
            value={loginCode}
            disabled={loading}
            onChange={(e) => setLoginCode(e.target.value.toUpperCase().substring(0, 6).split("").filter(e => "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split('').includes(e)).join(""))}
          />
          <a
            href="/login"
            {...$({ textDecoration: "none", cursor: loading ? "default" : "pointer" })}
            onClick={async (e) => {
              if(loading) return;
              e.preventDefault();
              const { authorized } = await api.auth.sessions.authorize.post({
                loginCode
              });
              if (!authorized) return alert("INVALID LOGIN CODE!");
              if (authorized) router.push("/dashboard");
            }}
          >
            <h2
              {...$({
                fontFamily: "system-ui",
                padding: "8px",
                textDecoration: "none",
                color: "var(--tan)"
              })}
            >
              →
            </h2>
          </a>
        </div>
      </div>
    </Login>
  );
}
