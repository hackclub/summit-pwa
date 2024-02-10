import React, { useState, useEffect } from "react";
import { QrReader } from "react-qr-reader";
import Session from "@/lib/sessions";
import api from "@/lib/api";
import Ticket from "@/components/Ticket";

function DotDotDot () {
  const [dots, setDots] = useState(1);
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(dots => (dots) % 4 + 1);
    }, 500);
    return () => clearInterval(interval);
  
  }, []);
  return (
    <span>
      {".".repeat(dots)
      .split("")
      .map((dot, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
          {dot}
        </span>
      ))
      .reduce((acc, dot) => [acc, dot], [])
      .slice(0, -1)
      .map((dot, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.1}s` }}>
          {dot}
        </span>
      ))}
    </span>
  );
}

const successMessages = [
  "Welcome to the Summit",
  "You are checked in",
  "Welcome"
];

function Welcome ({ ticketNumber }) {
  return (
    <>
      {ticketNumber}
    </>
  )
}

const states = [
  "scan",
  "transmit",
  "display"
]

export default function Scan() {
  const [messages, setMessages] = useState([]);

  const [data, setData] = useState("");
  const [ticketNumber, setTicketNumber] = useState("");
  const [attendee, setAttendee] = useState(null);

  const [currentState, setCurrentState] = useState(0);
  const state = states[currentState % states.length];

  const next = () => setCurrentState(c => c + 1);

  const doCheckIn = async number => {
    const success = await api.irl.checkIn.post({ ticketNumber: number });

    if (success) {
      await new Promise(r => setTimeout(r, 1500));
      setAttendee(await api.irl.getAttendee.post({ ticketNumber: number }));
      window.checkedIn.push(number);
      setTicketNumber("");
      setData("");
      next();
    } else {
      alert("There was an error! Please ask a staff member for support.");
    }
  }

  useEffect(() => {
    window.newMessage = async message => {
      switch (message.name) {
        // case "staff:checkin.success":
        //   console.log(ticketNumber, message.data, state);
        //   if (ticketNumber == message.data.ticketNumber && state == "transmit") {
        //     setAttendee(await api.irl.getAttendee.post({ ticketNumber }));
        //     window.checkedIn.push(ticketNumber);
        //     setTicketNumber("");
        //     setData("");
        //     next();
        //   }
          
        //   break;
      }
    }
  }, [ticketNumber, state]);

  useEffect(() => {
    if (state == "display") {
      setTimeout(() => next(), 5000);
    }
  }, [state]);

  useEffect(() => {
    if (!window.checkedIn) window.checkedIn = [];
    if (!window.acked) window.acked = [];
    if (!window.sticketingLoadedAt) window.sticketingLoadedAt = Date.now();

    const interval = setInterval(async () => {
      const { messages } = await api.irl.receive.get();
      
      for (const message of messages) {
        if (message.name.startsWith("scan:") || window.acked.includes(message.id) || message.timestamp < window.sticketingLoadedAt) continue;

        console.log(window.acked, message.id);
        setMessages(c => [...c, message]);
        window.acked.push(message.id);
        
        window.newMessage(message);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const number = data.split("/").reverse()[0];
      if (number.length == 13 && state == "scan" && !window.checkedIn.includes(number)) {
        setTicketNumber(number);
        next();
        setAttendee(null);
        doCheckIn(number).then(() => {;
          api.irl.transmit.post({
            name: 'scan:ticket.scan',
            data: {
              ticketNumber: number
            }
          }).then(console.log);
        });
      }
    } catch (e) {}
  }, [data, state]);
  
  const handleScanResult = (result, error) => {
    if (result) {
      console.log('result', result.text)
      setData(result.text);
    }
  };

  return (
    <>
      {state == "scan" && (
        <div className={"akaya"} style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2rem",
          gap: "1rem",
          height: "100vh",
        }}>
          <div style={{
            width: "300px",
            height: "300px",
            boxSizing: "border-box",
            overflow: "hidden",
            borderRadius: "24px",
            transform: "translateZ(0)"
          }}>
            <div style={{
              width: "100%",
              height: "100%",
              scale: '1.5'
            }}>
              <QrReader
                onResult={handleScanResult}
                
                constraints={{ facingMode: "user" }}
              />
            </div>
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            gap: "1rem",
          }}>
            <h1>Welcome, leader!</h1>
            <h2 className="mb3">Align your ticket's QR code to check in.</h2>
          </div>
        </div>
      )}
      {state == "transmit" && (
        <div className={"akaya"} style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2rem",
          gap: "1rem",
          height: "100vh",
        }}>
          <div style={{
            width: "300px",
            height: "300px",
            boxSizing: "border-box",
            overflow: "hidden",
            borderRadius: "24px"
          }}>
            <img src="https://icons.hackclub.com/api/icons/0xffec96/announcement" />
          </div>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            gap: "1rem",
          }}>
            <h1>Checking You In<DotDotDot /></h1>
            <h2 className="mb3">Please wait</h2>
          </div>
        </div>
      )}
      {state == "display" && (
        <div className={"akaya"} style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "2rem",
          gap: "1rem",
          height: "100vh",
        }}>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            flexGrow: 1,
            gap: "1rem",
          }}>
            <h1>You're all set, {attendee.fields.first_name}!</h1>
            <Ticket user={attendee} />
          </div>
        </div>
      )}
      <div style={{
        position: "absolute",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column"
      }} onClick={() => {
        location.reload();
      }}>
        <p className="cook">Hack Club Leaders Summit</p>
        <small>Click Here to Reload Ticketing Terminal</small>
      </div>
    </>
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
