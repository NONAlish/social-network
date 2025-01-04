import React from "react";
import { useRef } from "react";

interface TwoFactorAuthenticationProps {
  active: boolean;
  setActive: React.Dispatch<React.SetStateAction<boolean>>;
  hendle_send_singin_data: (code: string) => void;
}

const TwoFactorAuthentication: React.FC<TwoFactorAuthenticationProps> = ({
  active,
  setActive,
  hendle_send_singin_data,
}) => {
  const codeRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const code = codeRef.current?.value;
    if (code) {
      hendle_send_singin_data(code);
    }
    console.log(code);
    setActive(false);
  }

  return (
    <div
      className={`fixed w-[400px] bg-dark-blue p-6 rounded-lg shadow-lg ${
        active ? "block" : "hidden"
      }`}
    >
      <h2 className="text-white text-xl mb-4">Введите 6 значный код</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          ref={codeRef}
          maxLength={6}
          className="w-full p-2 rounded mb-4 text-black"
          placeholder="Enter the code"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default TwoFactorAuthentication;
