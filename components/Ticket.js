import { Akaya_Kanadaka, UnifrakturCook, Space_Mono } from "next/font/google";
const akaya = Akaya_Kanadaka({ weight: "400", subsets: ["latin"] });
const cook = UnifrakturCook({ weight: "700", subsets: ["latin"] });
const space = Space_Mono({ weight: "400", subsets: ["latin"] });
import Tilt from 'react-parallax-tilt';

function Cutout ({ side }) {
  return (
    <img src="/assets/cutout.png" className="absolute noselect nodrag" style={{
      top: "50%",
      [side]: "0px",
      transform: "translateY(-50%) " + (side === "right" ? "rotateY(180deg)" : "rotateY(0deg)"),
      height: "64px",
    }} />
  )
}

export default function Ticket ({ user }) {
  const data = new Proxy(user.fields, {
    get: (target, prop) => {
      const newProp = prop.startsWith("_") ? "ticketing_" + prop : prop;
      console.log(target, newProp);
      return target[newProp];
    }
  });

  return (
    <div className="nicescrollbar" style={{
      width: "100vw",
      maxWidth: "100vw",
      margin: '0px calc(0px - max(calc((100vw - 1000px) / 2), 24px))',
      overflowX: 'scroll',
      overflowY: 'hidden',
      whiteSpace: 'nowrap'
    }}>
      <div style={{
        margin: '24px max(calc((100vw - 1000px) / 2), 24px)',
        width: "max-content"
      }}>
      <Tilt>
        <div className="flex flex-row w-100 red-i relative" style={{
          width: "1000px"
        }}>
          <Cutout side="left" />
          <Cutout side="right" />
          <div className="flex bg-tan p3" style={{
            borderRadius: '16px',
            flex: '1',
            flexDirection: 'column',
            gap: '8px',
            border: '3px dotted var(--red)',
            padding: '64px 48px',
            paddingTop: '48px',
            paddingRight: '16px',
            backgroundImage: 'url(https://cloud-456eompb3-hack-club-bot.vercel.app/0big_ticket.png)',
            backgroundSize: 'cover',
          }}>
            <div className="flex" style={{alignItems: 'center', gap: '32px'}}>
              <h1 className={cook.className}>Leaders Summit</h1>
              <span className={space.className} style={{fontWeight: '500', fontSize: '1.7em'}}>{data._ticketNumber}</span>
            </div>
            <div className="flex" style={{flexDirection: 'column'}}>
                <span>Ticket issued to</span>
                <div className="flex" style={{alignItems: 'center', gap: '8px'}}>
                  <span style={{fontSize: '1.7em'}}>{data.first_name} {data.last_name}</span>
                  <span>from Shelburne, VT</span>
                </div>
              </div>
            <div className="grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px'}}>
              <div className="flex" style={{flexDirection: 'column'}}>
                <span>Starts at</span>
                <span style={{fontSize: '1.4em'}}>18:00 02/09</span>
              </div>
              <div className="flex" style={{flexDirection: 'column'}}>
                <span>Ends at</span>
                <span style={{fontSize: '1.4em'}}>18:00 02/11</span>
              </div>
              <div className="flex" style={{flexDirection: 'column'}}>
                <span>Venue</span>
                <span style={{fontSize: '1.4em'}}>The Light House (SF)</span>
              </div>
              <div className="flex" style={{flexDirection: 'column'}}>
                <span>T-Shirt</span>
                <span style={{fontSize: '1.4em'}}>{data['t-shirt']}</span>
              </div>
              <div className="flex" style={{flexDirection: 'column'}}>
                <span>Travel</span>
                <span style={{fontSize: '1.4em'}}>{data.transportation[0]}</span>
              </div>
              <div className="flex" style={{flexDirection: 'column'}}>
                <span>Dietary Restrictions</span>
                <span style={{fontSize: '1.4em'}}>{user.fields.tickets_shortDietaryRestrictions}</span>
              </div>
            </div>
          </div>
          <div className="flex bg-tan p3" style={{
            borderRadius: '16px',
            width: "300px",
            border: '3px dotted var(--red)',
            borderLeft: 'none',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <span style={{fontSize: '1.7em'}}>{data.first_name} {data.last_name}</span>
            <div className="flex mt1 mb2">
              <img src="https://cloud-elb91ms1w-hack-club-bot.vercel.app/0untitled_1_1.png" height="120px" />
              <img src="https://cloud-8vbegsy8w-hack-club-bot.vercel.app/0plane_1.png" height="50px" className="ml3 mt2" />
            </div>
            <div className="flex" style={{alignItems: 'center', gap: '8px'}}>
              <div>
                T-Shirt Size
              </div>
              <div style={{flexGrow: '1', height: '0.5px', border: '0.5px solid var(--red)'}} />
              <div>
                {data['t-shirt']}
              </div>
            </div>
            <div className="flex" style={{alignItems: 'center', gap: '8px'}}>
              <div>
                Dietary Restrictions
              </div>
              <div style={{flexGrow: '1', height: '0.5px', border: '0.5px solid var(--red)'}} />
              <div>
                {user.fields.tickets_shortDietaryRestrictions}
              </div>
            </div>
            <div className="flex" style={{alignItems: 'center', gap: '8px'}}>
              <div>
                Travel
              </div>
              <div style={{flexGrow: '1', height: '0.5px', border: '0.5px solid var(--red)'}} />
              <div>
              {data.transportation[0]}
              </div>
            </div>
            <div className="flex" style={{alignItems: 'center', gap: '8px'}}>
              <div>
                Hometown
              </div>
              <div style={{flexGrow: '1', height: '0.5px', border: '0.5px solid var(--red)'}} />
              <div>
                Shelburne, VT
              </div>
            </div>
          </div>
        </div>
      </Tilt>
      </div>
    </div>
  )
}
