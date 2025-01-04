import React from "react";
import { useState } from "react";
import useAuthNavigate from "../../../hooks/useAuthNavigate";

const PasswordRecovery: React.FC = () => {
  const [email, setEmail] = useState("");

  const navigateToAuth = useAuthNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Email form recovery password!");
    console.log(email);
  };

  return (
    <div className={`fixed w-[400px] bg-dark-blue p-6 rounded-lg shadow-lg`}>
      <h2 className="mb-6 text-3xl font-semibold text-gray-500">
        Password Recovery
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between mb-4">
          <label htmlFor="email" className="text-gray-500 text-lg w-[100px]">
            Enter Email:
          </label>

          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-[250px] overflow-y text-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none border-2"
            placeholder="Enter your's email"
          />
        </div>
        <button type="button" onClick={() => navigateToAuth("singin")}>
          Back
        </button>
        <button type="submit" className="ml-4">
          Next
        </button>
      </form>
    </div>
  );
};

export default PasswordRecovery;
