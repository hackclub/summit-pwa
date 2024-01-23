import { currentUser } from "@/lib/sessions";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { useRouter } from "next/router";
import $ from "@/utils/animation";
import api from "@/lib/api";
import Main from "@/components/layouts/Main";

export default function Dashboard({user}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <Main pageName="Dashboard" red>
      <h1 style={{
        marginBottom: '16px',
      }}>Welcome, {user.fields.first_name}!</h1>
      <p>You're all set. We'll see you at The Summit!</p>
      <br />
      <h2>Your Ticket</h2>
      <br />
      {/* <p>
        {JSON.stringify(user)}
      </p>
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
      </p> */}
      <img src="https://cloud-pw2yr4yha-hack-club-bot.vercel.app/0frame_3.svg" style={{
        width: '100%',
      }} />
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
  if(!user.fields.ticketing_ticketNumber) {
    return {
      redirect: {
        destination: "https://forms.hackclub.com/t/2HZmvUZVCqus?id=" + user.id,
        permanent: false,
      },
    }
  }
  return {
    props: {
      user
    }
  }
}