import { currentUser } from "@/lib/sessions";
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

export default function Dashboard({user}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dev = useDevMode();

  const waiverStatus = user.fields.ticketing_waiverStatus;

  return (
    <Main pageName="Dashboard" red>
      <h1 className="mb2">Welcome, {user.fields.first_name}!</h1>

      {waiverStatus == "signed" ? <>
        Waiver Signed
      </> : waiverStatus == "sent" ? <>
        Waiver Sent
      </> : waiverStatus == "pending" ? <>
        Waiver Pending
      </> : <>Something went wrong.</>}

      <Ticket user={user} />

      <Link href={`/api/passes/${user.fields.ticketing_passId}/pass.pkpass`} prefetch={false} target="_parent">
        <img src="https://support.apple.com/library/content/dam/edam/applecare/images/en_US/iOS/add-to-apple-wallet-logo.png" style={{height: "64px"}} alt="Add to Apple Wallet" />
      </Link>

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
  const sessionId = getCookie('session', { req, res });
  const user = await currentUser(sessionId);
  if(!user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }
  // if(!user.fields.ticketing_ticketNumber) {
  //   return {
  //     redirect: {
  //       destination: "https://forms.hackclub.com/t/2HZmvUZVCqus?id=" + user.id,
  //       permanent: false,
  //     },
  //   }
  // }
  return {
    props: {
      user
    }
  }
}