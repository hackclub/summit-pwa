import { currentUser } from "@/lib/sessions";
import { getCookie } from "cookies-next";

export default function Dashboard({user}) {
  return (
    <div>
      <h1>Dashboard</h1>
      {JSON.stringify(user)}
    </div>
  );
}

export const getServerSideProps = async ({req, res}) => {
  const sessionId = getCookie('session', { req, res });
  const user = await currentUser(sessionId);
  return {
    props: {
      user
    }
  }
}