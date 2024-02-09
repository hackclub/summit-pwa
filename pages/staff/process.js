import Session from "@/lib/sessions";
import Main from "@/components/layouts/Main";
import Link from "next/link";
import api from "@/lib/api";
import { useEffect, useState } from "react";

export default function Dashboard({ admin }) {
  const [messages, setMessages] = useState([]);
  const [attendees, setAttendees] = useState({});
  const [checkedIn, setCheckedIn] = useState([]);
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

    setCheckedIn(c => [...c, ticketNumber]);
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
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {scans.map(scan => {
          const attendee = attendees[scan.ticketNumber];
          const fields = attendee?.fields || {};
          const ticketed = checkedIn.includes(scan.ticketNumber);

          return (
            <div key={scan.timestamp} style={{
              display: 'flex',
              border: '2px solid var(--tan)',
              flexDirection: 'column'
            }}>
              <div style={{
                background: 'var(--tan)',
                color: 'var(--red)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between'
              }}>
                <h2 className="mb0 mt0">{fields.first_name + " " + fields.last_name}</h2>
                <h2 className="space mb0 mt0">{scan.ticketNumber}</h2>
              </div>
              <div style={{
                padding: '1rem',
                display: 'flex',
                flexDirection: 'row',
              }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gridGap: "10px",
                  flexGrow: '1',
                  height: "min-content"
                }}>
                  <h3 className="mt0 mb0">T-Shirt Size</h3>
                  <h3 className="mt0 mb0">{fields["t-shirt"]}</h3>
                  <h3 className="mt0 mb0">Travel</h3>
                  <h3 className="mt0 mb0">{fields.transportation} from {fields.travelingFrom}</h3>
                  <h3 className="mt0 mb0">Already Checked In?</h3>
                  <h3 className="mt0 mb0">{!!fields.ticketing_checkedIn}</h3>
                  <h3 className="mt0 mb0">Waiver</h3>
                  <h3 className="mt0 mb0">{fields.ticketing_waiverType ?? "Special"} — {fields.ticketing_waiverStatus}</h3>
                  <h3 className="mt0 mb0">Dietary</h3>
                  <h3 className="mt0 mb0">{fields.ticketing_dietaryRestrictions ?? "None"}</h3>
                </div>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  maxWidth: '300px',
                }}>
                  <h3 style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '1rem'
                  }} className="h2">
                    <img style={{ height: "56px" }} src={`https://icons.hackclub.com/api/icons/0xffec96/${ticketed ? "checkmark" : "important"}`} />
                    <span>
                      Status: {ticketed ? "Checked In" : "Scanned"}
                    </span>
                  </h3>
                  {/* <pre>{JSON.stringify(attendees[scan.ticketNumber], null, 4)}</pre> */}
                  <button disabled={ticketed} aria-disabled={ticketed} onClick={() => checkIn(scan.ticketNumber)}>{ticketed ? "Checked In" : "Check In"}</button>
                </div>
              </div>
            </div>
          )
        })}
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
