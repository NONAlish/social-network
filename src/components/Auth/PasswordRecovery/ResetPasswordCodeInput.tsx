import React from 'react'
import { useNavigate } from 'react-router-dom'

const ResetPasswordCodeInput: React.FC = () => {

  const navigate = useNavigate();

  function handleSubmit(){}
  return (
    <div className={`fixed w-[400px] bg-dark-blue p-6 rounded-lg shadow-lg`}>
    <h2 className="mb-6 text-3xl font-semibold text-white">
      Reset Password
    </h2>
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col mb-4">
        <label htmlFor="email" className="text-white text-lg mb-2">
          Enter 6 digits code
        </label>

        <input
          type="number"
          id="email"
          name="email"

          required
          className="w-[250px] overflow-y text-black p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
          placeholder="Enter your's email"
        />
      </div>
      <button type="button" onClick={() => navigate('/singin')}>Back</button>
      <button type="submit" className="ml-4">Submit</button>
    </form>
  </div>
  )
}

export default ResetPasswordCodeInput;
