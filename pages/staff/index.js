import Session from "@/lib/sessions";
import Main from "@/components/layouts/Main";
import Link from "next/link";

export default function Dashboard({ admin }) {
  return (
    <Main pageName="Dashboard" red>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}>
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "16px"
        }}>
          <Link href="/staff/scan">
            <button>Open Scanner App</button>
          </Link>
          <p>Open the visual check in app for iPad hardware</p>
        </div>
        <div style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "16px"
        }}>
          <Link href="/staff/process">
            <button>Open Check In Console</button>
          </Link>
          <p>Open the organizer console for processing tickets</p>
        </div>
      </div>
    </Main>
  );
}

export const getServerSideProps = async ({req, res}) => {
  const session = await Session.from(req, res);

  if (!session.authorized || !session.organizer) {
    return {
      redirect: {
        destination: '/staff/login',
        permanent: false,
      },
    }
  }

  const user = await session.currentUser();
    
  return {
    props: {
      user
    }
  }
}
