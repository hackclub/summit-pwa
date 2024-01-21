import { currentUser } from "@/lib/sessions";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { useRouter } from "next/router";
import $ from "@/utils/animation";
import api from "@/lib/api";

export default function Dashboard({user}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>
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
      </p>
    </div>
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
  return {
    props: {
      user
    }
  }
}