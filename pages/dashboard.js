import { currentUser } from "@/lib/sessions";
import { getCookie } from "cookies-next";
import { useState } from "react";
import { useRouter } from "next/router";
import $ from "@/utils/animation";
import api from "@/lib/api";
import Main from "@/components/layouts/Main";
import useDevMode from "@/utils/useDevMode";
import Input from "@/components/Input";

function Form () {
  const router = useRouter();
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [waiverType, setWaiverType] = useState("");
  const [dietaryRestrictions, setDietaryRestrictions] = useState("");

  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}>
        <Input name="dietaryRestrictions" label="Dietary Restrictions" placeholder="For example, 'Vegetarian'" value={dietaryRestrictions} onChange={e => {
          const newDietaryRestrictions = e.target.value;

          setDietaryRestrictions(newDietaryRestrictions);
        }} />

        <Input name="age" label="Age" placeholder="Your age" value={age} onChange={e => {
          const newAge = e.target.value;

          setAge(newAge.substring(0, 3).split('.').join(''))
        }} />
        
        {age && +age < 18 && <>
          <Input name="email" label="Parent/Guardian Email Address" placeholder="Parent/Guardian Email" type="email" value={email} onChange={e => {
            const newEmail = e.target.value;

            setEmail(newEmail);
          }} />
          <p>(We need this to send your parents a waiver)</p>
        </>}

        <div>
          <h3>What type of waiver would you like?</h3>
          <p>We offer a standard waiver which gives attendees the ability to participate in all Summit activities (including staffed outings).<br />We also offer a freedom waiver which includes the benefits of the standard waiver, but also gives attendees the freedom to explore with their team.<br/>We suggest the freedom waiver!</p>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            marginTop: '8px'
          }}>
            <div style={{
              border: '1px solid var(--tan)',
              padding: '8px',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              cursor: 'pointer',
              background: waiverType == "freedom" ? "var(--tan)" : "",
              color: waiverType == "freedom" ? "var(--red)" : ""
            }} onClick={() => {
              setWaiverType("freedom");
            }}>
              <input id="waiverType_freedom" type="radio" name="waiverType" value="freedom" checked={waiverType === "freedom"} onChange={e => {
                setWaiverType(e.target.value);
              }} style={{
                cursor: 'pointer'
              }} />
              <label for="waiverType_freedom" style={{ cursor: 'pointer' }}>Standard Waiver</label>
            </div>
            <div style={{
              border: '1px solid var(--tan)',
              padding: '8px',
              borderRadius: '4px',
              display: 'flex',
              flexDirection: 'row',
              gap: '8px',
              cursor: 'pointer',
              background: waiverType == "standard" ? "var(--tan)" : "",
              color: waiverType == "standard" ? "var(--red)" : ""
            }} onClick={() => {
              setWaiverType("standard");
            }}>
              <input id="waiverType_standard" type="radio" name="waiverType" value="standard" checked={waiverType === "standard"} onChange={e => {
                setWaiverType(e.target.value);
              }} style={{
                cursor: 'pointer'
              }} />
              <label for="waiverType_standard" style={{ cursor: 'pointer' }}>Freedom Waiver</label>
            </div>
          </div>
        </div>

      </div>
      <br />
      <br />
      <button style={{ color: `var(--red)` }} onClick={async () => {
        let error = 0;
        try {
          const { updated } = await api.attendee.setConfirmInfo.post({
            email,
            dietaryRestrictions,
            age: +age,
            waiverType
          });
          if (!updated) error = 3;
        } catch (err) { error = 4 }

        if (error) {
          alert("Something went wrong. Please contact the team in #the-summit on Slack with the error code ERR-CONFIRM-" + error);
        } else router.reload();
      }}>Submit</button>
    </>
  )
}

export default function Dashboard({user}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const dev = useDevMode();

  return (
    <Main pageName="Dashboard" red>
      {!user.fields.ticketing_attendanceConfirmed ? <>
        <h1 style={{
          marginBottom: '8px',
        }}>Hello, {user.fields.first_name}!</h1>
        <h2>Let's get you confirmed for The Summit.</h2>
        <br />
        <p>
          Will you be able to attend the Hack Club Leaders Summit taking place in San Francisco from February 9th to 11th, 2024?
        </p>
        <br />
        <button style={{ color: `var(--red)` }} onClick={async () => {
          let error = 0;
          try {
            const { updated } = await api.attendee.confirm.post();
            if (!updated) error = 1;
          } catch (err) { error = 2 }

          if (error) {
            alert("Something went wrong. Please contact the team in #the-summit on Slack with the error code ERR-CONFIRM-" + error);
          } else router.reload();
        }}>Yes!</button>
      </> : !user.fields.ticketing_age ? <>
        <h1 style={{
          marginBottom: '8px',
        }}>Hello, {user.fields.first_name}!</h1>
        <h2>Your attendance has been confirmed!</h2>
        <br />
        <p>
          Next Steps: We need a bit more information about you.
        </p>
        <br />
        <Form />
      </> : <>
        <h1 style={{
            marginBottom: '8px',
        }}>Welcome, {user.fields.first_name}!</h1>
        <h2>You're all set for now!</h2>
        <br />
        <p>
          We'll email you with more information as the event gets closer. Thanks!
        </p>
        <br />
      </>}

      {dev ? <>
        <br />
        <br />
        <h2>Data for Developers</h2>
        <pre>
          {JSON.stringify(user, null, 4)}
        </pre>
        <br />
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
      </> : ($({}), null)}
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
  // if(!user.fields.ticketing_ticketNumber) {
  //   return {
  //     redirect: {
  //       destination: "https://forms.hackclub.com/t/2HZmvUZVCqus?id=" + user.id,
  //       permanent: false,
  //     },
  //   }
  // }
  return {
    props: {
      user
    }
  }
}