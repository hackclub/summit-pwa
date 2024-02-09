import Session from "@/lib/sessions";
import Main from "@/components/layouts/Main";

export default function Dashboard({ admin }) {
  return (
    <Main pageName="Dashboard" red>
      womp womp
    </Main>
  );
}

export const getServerSideProps = async ({req, res}) => {
  const session = await Session.from(req, res);

  if (!session.authorized) {
    return {
      redirect: {
        destination: '/staff/login',
        permanent: false,
      },
    }
  }
  
  return {
    props: {
      admin: {}
    }
  }
}
