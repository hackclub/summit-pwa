import $ from "@/utils/animation";
import Head from "next/head";
import { Akaya_Kanadaka, UnifrakturCook } from "next/font/google";
import Link from "next/link";
import Login from "@/components/layouts/Login";

const akaya = Akaya_Kanadaka({ weight: "400", subsets: ["latin"] });
const cook = UnifrakturCook({ weight: "700", subsets: ["latin"] });

export default function Register() {
  return (
    <Login pageName="Register">
      <h1
        {...$({
          marginBottom: "16px",
          animate$fadeIn: {
            duration: "0.5s",
            delay: "0s",
            args: ["fromBottom"]
          }
        })}
      >
        Oops...
      </h1>

      <p
        {...$({
          marginBottom: "24px",
          animate$fadeIn: {
            duration: "0.5s",
            delay: "0.5s",
            args: ["fromBottom"]
          }
        })}
      >
        It looks like this email hasn't registered for the Leaders Summit yet.
        You can register to join us,
        or you could try a different email address.
      </p>

      <div
        {...$({
          display: "flex",
          gap: "1rem"
        })}
      >
        <Link href="/">
          <button class="outlined">Back</button>
        </Link>

        <Link href="https://summit.hackclub.com/#dream">
          <button class="red">Register →</button>
        </Link>
      </div>
    </Login>
  );
}
