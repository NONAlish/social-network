import React from "react";
import useAuthNavigate from "../../hooks/useAuthNavigate";
import { useRef } from "react";

interface Email {
  email: string;
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  send_verification_code: (code: string) => void;
}

const EmailConfirmation: React.FC<Email> = ({
  email,
  active,
  setActive,
  send_verification_code,
}) => {
  const navigateToAuth = useAuthNavigate();

  const codeRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const code = codeRef.current?.value;
    console.log("Code:", code);
    if (code) {
      send_verification_code(code);
    }
    setActive(false);
  }

  return (
    <div
      className={`fixed w-[400px] bg-dark-blue p-6 rounded-lg shadow-lg ${
        active ? "block" : "hidden"
      }`}
    >
      <h2 className="text-white text-xl mb-4">
        Введите 6 значный код который прийдет вам на {email}
      </h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          ref={codeRef}
          maxLength={6}
          className="w-full p-2 rounded mb-4 text-black"
          placeholder="Enter the code"
        />
        <div className="w-full flex space-x-2">
          {" "}
          <button
            type="button"
            onClick={() => navigateToAuth("singup")}
            className="w-1/2 pr-2 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Back
          </button>
          <button
            type="submit"
            className="w-1/2 pl-2 justify-end py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailConfirmation;
