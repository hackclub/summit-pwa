import { Akaya_Kanadaka } from "next/font/google";
import { Link } from "next/link";

const akaya = Akaya_Kanadaka({ weight: "400", subsets: ["latin"] });

export default function Home() {
  return (
    <main className={akaya.className}>
      <div style={{
        width: "calc(100% - 80px)",
        height: "300px",
        margin: "40px",
        border: "4px solid var(--tan)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <div style={{
          width: "100%",
          height: "100%",
          border: "6px solid var(--red)",
          background: "var(--tan)",
          color: "var(--red)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <h1>Summit Ticketing</h1>
        </div>
      </div>

      <div style={{
        width: "calc(100% - 80px)",
        margin: "40px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <Link href="#" style={{
          width: "100%",
          padding: "20px",
          border: "4px solid var(--tan)",
          background: "var(--red)",
          color: "var(--tan)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "unset",
          cursor: "pointer"
        }}>
          <h2>Get Your Ticket</h2>
        </Link>
      </div>
    </main>
  )
}
