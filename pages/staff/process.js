import Session from "@/lib/sessions";
import Main from "@/components/layouts/Main";
import Link from "next/link";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export default function Dashboard({ admin }) {
  const [messages, setMessages] = useState([]);
  const [attendees, setAttendees] = useState({});
  const [scans, setScans] = useState([]);

  const checkIn = async ticketNumber => {
    try {
      const success = await api.irl.checkIn.post({ ticketNumber });
      if (!success) throw "Failure: Check-in failed";
    } catch (err) {
      console.error(err);
      return await api.irl.transmit.post({
        name: 'staff:checkin.failure',
        data: {
          ticketNumber: ticketNumber
        }
      });
    }

    await api.irl.transmit.post({
      name: 'staff:checkin.success',
      data: {
        ticketNumber: ticketNumber,
      }
    });
  }
  
  const newMessage = async message => {
    switch (message.name) {
      case "scan:ticket.scan":
        try {
          const attendee = await api.irl.getAttendee.post({ ticketNumber: message.data.ticketNumber });
          if (!attendee) throw "Failure: Attendee not found";

          setAttendees(c => ({ ...c, [message.data.ticketNumber]: attendee }));
          setScans(c => [...c, {
            timestamp: message.timestamp,
            ticketNumber: message.data.ticketNumber
          }]);
        } catch (err) {
          console.error(err);
          return await api.irl.transmit.post({
            name: 'staff:checkin.failure',
            data: {
              ticketNumber: message.data.ticketNumber
            }
          });
        }

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
      
      {scans.map(scan => (
        <div key={scan.timestamp}>
          <h2>{scan.ticketNumber}</h2>
          <button onClick={() => checkIn(scan.ticketNumber)}>Check In</button>
        </div>
      ))}

      <pre>
        {JSON.stringify(scans, null, 4)}
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
