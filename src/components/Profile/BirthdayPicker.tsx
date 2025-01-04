import React, { useState } from "react";



interface Birthday {
  day: string;
  month: string;
  year: string;
}

interface Data {
  firstName: string;
  lastName: string;
  gender?: string;
  birthday?: Birthday;
  username: string;
}

interface BirthdayPickerProps {
  data: Data;
}

const BirthdayPicker: React.FC<BirthdayPickerProps> = ({data}) => {
  const [day, setDay] = useState(data.birthday?.day || "1");
  const [month, setMonth] = useState(data.birthday?.month ||"Jan");
  const [year, setYear] = useState(data.birthday?.year ||"2000");

  return (
    <div className="flex space-x-4 items-center">
      <div>
        <label htmlFor="day" className="block text-sm font-medium text-ash-300 mb-1">Day</label>
        <select
          id="day"
          value={day}
          onChange={(e) => setDay(e.target.value)}
          className="w-12 h-8 bg-ash-700 text-white rounded-md border border-ash-500 focus:ring-2 focus:ring-blue-500 pl-2 text-xs"
        >
          {[...Array(31)].map((_, i) => (
            <option key={i}>{i + 1}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="month" className="block text-sm font-medium text-ash-300 mb-1">Month</label>
        <select
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-14 h-8 bg-ash-700 text-white rounded-md border border-ash-500 focus:ring-2 focus:ring-blue-500 pl-2 text-xs"
        >
          {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="year" className="block text-sm font-medium text-ash-300 mb-1">Year</label>
        <select
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-16 h-8 bg-ash-700 text-white rounded-md border border-ash-500 focus:ring-2 focus:ring-blue-500 flex justify-center pl-2 text-xs"
        >
          {[...Array(100)].map((_, i) => (
            <option key={i}>{2024 - i}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BirthdayPicker;
