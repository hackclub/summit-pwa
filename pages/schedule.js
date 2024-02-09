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
import Schedule from "@/components/schedule/Schedule";

export default function Dashboard({ user }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dev = useDevMode();

  const waiverStatus = user.fields.ticketing_waiverStatus;

  return (
    <Main pageName="Dashboard" red>
      <Schedule />
    </Main>
  );
}

export const getServerSideProps = async ({req, res}) => {
  const session = await Session.from(req, res);

  if (!session.authorized) {
    return {
      props: {
        user: null
      }
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
