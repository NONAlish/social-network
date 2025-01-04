import InputField from "../../../components/Auth/InputField";
// import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AuthHeader from "../../../components/Auth/AuthHeader";
import EmailConfirmation from "../../../components/Auth/EmailConfirmation";
import axios from "axios";

const Login: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [active, setActive] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [data, setData] = useState<object>({});

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const emailValue = emailRef.current?.value;
    const password = passwordRef.current?.value;

    setData({
      emailValue: emailValue,
      password: password,
    });
    setEmail(emailValue || "");
    setActive(true);

    sendSingUpForm();
  }

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      console.log(data);
    }
  }, [data]);

  async function sendSingUpForm() {
    try {
      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/auth/get_singup_date/",
        data: {},
      });
      const data = response.data;
      console.log("Data was successfully sent");
      console.log(data);
      return data;
    } catch (error) {
      console.error("An error occurred:", error);
      throw new Error("Something went wrong!");
    }
  }

  async function send_verification_code(code: string) {
    try {
      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/auth/get_email_verification_code/",
        data: {
          verification_code: code,
        },
      });
      const data = response.data;
      console.log("Data was successfully sent");
      console.log(data);
      return data;
    } catch (error) {
      console.error("An error occurred:", error);
      throw new Error("Something went wrong!");
    }
  }

  return (
    <>
      <div
        className={`w-[400px] bg-dark-blue p-6 rounded-lg shadow-lg ${
          active ? "opacity-20" : ""
        }`}
      >
        <AuthHeader />
        <form onSubmit={handleSubmit}>
          {" "}
          <InputField
            type="email"
            id="email"
            name="email"
            placeholder="Enter your Email"
            htmlFor="email"
            label="Email"
            ref={emailRef}
            required
          />
          <InputField
            type="password"
            id="password"
            name="password"
            placeholder="Enter your Password"
            htmlFor="password"
            label="Password"
            ref={passwordRef}
            required
          />
          <div className="flex items-center justify-between space-x-8">
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
      <EmailConfirmation
        email={email}
        active={active}
        setActive={setActive}
        send_verification_code={send_verification_code}
      />
    </>
  );
};

export default Login;
