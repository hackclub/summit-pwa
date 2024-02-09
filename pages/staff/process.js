import Session from "@/lib/sessions";
import Main from "@/components/layouts/Main";
import Link from "next/link";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export default function Dashboard({ admin }) {
  const [messages, setMessages] = useState([]);
  
  const newMessage = async message => {
    switch (message.name) {
      case "scan:ticket.scan":
        alert(`🎟️ A ticket was scanned: ${message.data}`);

        const success = await api.irl.checkIn.post({ ticketNumber: message.data.ticketNumber });

        if (!success) {
          return await api.irl.transmit.post({
            name: 'staff:checkin.failure',
            data: {
              ticketNumber: message.data.ticketNumber
            }
          });
        }

        console.log(success);

        await api.irl.transmit.post({
          name: 'staff:checkin.success',
          data: {
            ticketNumber: message.data.ticketNumber,
          }
        });
        
        break;
    }
  }

  useEffect(() => {
    if (!window.acked) window.acked = [];
    if (!window.sticketingLoadedAt) window.sticketingLoadedAt = Date.now();

    const interval = setInterval(async () => {
      const { messages } = await api.irl.receive.get();
      
      for (const message of messages) {
        if (message.name.startsWith("staff:") || window.acked.includes(message.id) || message.timestamp < window.sticketingLoadedAt) continue;

        console.log(window.acked, message.id);
        setMessages(c => [...c, message]);
        window.acked.push(message.id);
        
        newMessage(message);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Main pageName="Dashboard" red>
      <h1>Check In Console</h1>
      

      <pre>
        {JSON.stringify(messages, null, 4)}
      </pre>
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
