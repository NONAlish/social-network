import InputField from "../../../components/Auth/InputField";
import { useRef, useState } from "react";
import TwoFactorAuthentication from "../../../components/Auth/TwoFactorAuthentication";
import AuthHeader from "../../../components/Auth/AuthHeader";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface LoginData {
  email: string;
  password: string;
}

const initialLoginData = { email: "", password: "" };

const Login: React.FC = () => {
  const [data, setData] = useState<LoginData>(initialLoginData);
  const [modelTwoFactorActive, setModelTwoFactorActive] = useState(false);
  const navigate = useNavigate();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newFromData = {
      email: emailRef.current?.value || "",
      password: passwordRef.current?.value || "",
    };

    setData(newFromData);

    setModelTwoFactorActive(true);
    console.log(modelTwoFactorActive);
  };

  function handleChangePassword() {
    navigate("/auth/password_recovery");
  }

  async function send_singin_data() {
    try {
      const response = await axios({
        method: "post",
        url: "http://127.0.0.1:8000/api/auth/get_singin_date",
        data: {
          email: data.email,
          password: data.password,
        },
      });
      const responseData = response.data;
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div
        className={`w-[400px] bg-dark-blue p-6 rounded-lg shadow-lg ${
          modelTwoFactorActive ? "hidden" : "block"
        }`}
      >
        <AuthHeader />
        <form onSubmit={handleSubmit}>
          <InputField
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            htmlFor="email"
            label="Email"
            ref={emailRef}
            required
          />
          <InputField
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            htmlFor="password"
            label="Password"
            ref={passwordRef}
            required
          />
          <div className="flex items-center justify-between pt-2 space-x-8">
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </div>
        </form>
        <p className="w-full text-center mt-6">
          <button onClick={handleChangePassword}>Forgot your password?</button>
        </p>
      </div>
      <TwoFactorAuthentication
        active={modelTwoFactorActive}
        setActive={setModelTwoFactorActive}
        hendle_send_singin_data={send_singin_data}
      />
    </>
  );
};

export default Login;
