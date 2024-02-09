import $ from "@/utils/animation";
import Head from "next/head";
import useBreakpoints from "@/utils/useBreakpoints";

export default function Login({ pageName, children, limitedAnimations = false, onFlagClick, staff }) {
  return (
    <main
      {...$["akaya"]({
        width: "100vw",
        height: "100vh",
        padding: "0px",
        margin: "0px",
        display: "flex",
        flexDirection: ["column-reverse", "row"]
      })}
    >
      <Head>
        <title>{pageName} – Hack Club Leaders Summit</title>
      </Head>
      <section
        {...$({
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "start",
          width: ["100vw", "400px", "min(40vw, 600px)"],
          background: "var(--tan)",
          color: "var(--red)",
          padding: ["40px 24px", "24px"]
        })}
      >
        {children}
      </section>

      <aside
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
              ...(limitedAnimations ? {} : {
                animate$fadeIn: {
                  args: ["fromBottom"],
                  delay: "0.5s"
                }
              })
              
            })}
            src={staff ? "https://icons.hackclub.com/api/icons/0xffec96/clubs-fill" : "https://cloud-fn8ydpafc-hack-club-bot.vercel.app/0flag-standalone-bw__2__1.svg"}
            onClick={onFlagClick}
          />
          <h1
            {...$["cook"]({
              ...(limitedAnimations ? {} : {
                animate$fadeIn: {
                  args: ["fromBottom"],
                  delay: "1s"
                }
              })
            })}
          >
            {staff ? "Summit Organizers" : "Leaders Summit"}
          </h1>
        </div>
      </aside>
    </main>
  );
}
