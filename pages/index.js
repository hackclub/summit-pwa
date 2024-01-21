import $ from "@/utils/animation";
import { Akaya_Kanadaka, UnifrakturCook } from "next/font/google";
import Link from "next/link";

const akaya = Akaya_Kanadaka({ weight: "400", subsets: ["latin"] });
const cook = UnifrakturCook({ weight: "700", subsets: ["latin"] });

export default function Home() {
  return (
    <main className={akaya.className} style={{
      width: "100vw",
      height: "100vh",
      padding: "0px",
      margin: "0px",
      display: "flex",
      flexDirection: "row",
    }}>
      <div {...$({
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "start",
        width: "min(40vw, 600px)",
        background: "var(--tan)",
        color: "var(--red)",
        padding: "24px",
      })}>
        <div {...$({
          animate$fadeIn: {
            args: ["fromBottom"],
            duration: "0.5s"
          }
        })}>

          <h1 style={{
            marginBottom: "16px",
          }}>Welcome!</h1>

          <p style={{
            marginBottom: "24px",
          }}>Sign in to access your ticket, view the event schedule, select workshops, and more!</p>

          <div style={{
            width: "min(100%, 400px)",
            gap: "12px",
            display: "flex",
            flexDirection: "column",  
          }}>
            <div style={{
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
            }}>
              <style dangerouslySetInnerHTML={{__html: `
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
              `}} />
              <input style={{
                padding: "8px",
                fontSize: "24px",
                flexGrow: "1",
                border: "2px solid var(--red)",
                background: "var(--tan)",
                color: "var(--red)",
                borderRadius: "8px",
                outlineColor: "white",
                outlineWidth: "2px",
              }} className={akaya.className + " inputFocus"} placeholder="Email" />
              <a href="/" style={{ textDecoration: "none" }}>
                <h2 style={{ fontFamily: "system-ui", padding: "8px", textDecoration: "none", color: "var(--tan)" }}>→</h2>
              </a>
            </div>
          </div>
          
        </div>
        
      </div>

      <div style={{
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
        backgroundSize: "contain",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "min(35vh, 310px)",
          gap: "30px",
        }}>
          <img style={{ maxWidth: "min(30vw, 180px)" }} src="https://cloud-fn8ydpafc-hack-club-bot.vercel.app/0flag-standalone-bw__2__1.svg" />
          <h1 className={cook.className}>Leaders Summit</h1>
        </div>
      </div>
    </main>
  )
}
