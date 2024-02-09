import Session from "@/lib/sessions";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { useRouter } from "next/router";
import $ from "@/utils/animation";
import api from "@/lib/api";
import Main from "@/components/layouts/Main";
import useDevMode from "@/utils/useDevMode";
import Input from "@/components/Input";
import Link from "next/link";
import Ticket from "@/components/Ticket";
import { generateTicket } from "./api/attendee/generateTicket";

export default function Dashboard({ user }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dev = useDevMode();

  const waiverStatus = user.fields.ticketing_waiverStatus;

  return (
    <Main pageName="Dashboard" red>
      {waiverStatus == "signed" ?
        <>
          <h1 className="mb2">Welcome, {user.fields.first_name}!</h1>
          
          <p className="h3">You're all set for The Summit! Save this ticket & have it ready at the door.</p>

          <Ticket user={user} />

          <Link href={`/api/passes/${user.fields.ticketing_passId}/pass.pkpass`} prefetch={false}>
            <img src="https://support.apple.com/library/content/dam/edam/applecare/images/en_US/iOS/add-to-apple-wallet-logo.png" style={{height: "64px"}} alt="Add to Apple Wallet" />
          </Link>
        </>
      :
        <>
          <h2 className="mb2">To receive your ticket, please sign the waiver emailed to you.</h2>
          <p className="h3 mb3">Once it's been signed, it may take a bit for your ticket to be generated. Can't find the email in your inbox? Please email <a href="mailto:jasper@hackclub.com">jasper@hackclub.com</a>.</p>
          <img src="https://raw.githubusercontent.com/hackclub/dinosaurs/main/dinosaur_sealing_letters_with_wax.png" height="400px" style={{ borderRadius: '16px', maxWidth: '70vw' }} />
        </>
      }

      {dev ? <> 
        <br />
        <br />
        {/* Enable this menu in the frontend by running `dev.on` in the console */}
        <h2>Data for Developers</h2>
        <pre>
          {JSON.stringify(user, null, 4)}
        </pre>
        <br />
        <p>
          <a
            href="/"
            {...$({ cursor: loading ? "default" : "pointer", color: 'white' })}
            onClick={async (e) => {
              if(loading) return;
              e.preventDefault();
              setLoading(true);
              await api.auth.sessions.destroy.post();
              router.push("/");
            }}
          >
            {loading ? "👋👋👋👋👋👋👋👋👋" : "Sign out"}
          </a>
        </p>
      </> : ($({}), null)}
    </Main>
  );
}

export const getServerSideProps = async ({req, res}) => {
  const session = await Session.from(req, res);

  if (!session.authorized) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const user = await session.currentUser();
  
  if(!user.fields.ticketing_ticketNumber) {
    await generateTicket(user)
  }
  
  return {
    props: {
      user
    }
  }
}
