import { useState } from "react";

interface Data {
  briefInformation: string;
  hometown: string
}

const EditBriefInfo: React.FC<Data> = ({briefInformation, hometown}) => {

  const [briefInformationValue, setBriefInformationValue] = useState(briefInformation);
  const [hometownValue, setHometownCalue] = useState(hometown)

  function handleChangeBriefInformation(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setBriefInformationValue(e.target.value)
  }

  function handleChangeHometown(e: React.ChangeEvent<HTMLInputElement>) {
    setHometownCalue(e.target.value)
  }



  return (
    <div className="w-[700px] h-[450px] bg-ash-500 rounded-2xl relative mt-12">
    <div className="p-12">
      <div className="flex pb-8">
        <label className="whitespace-nowrap pr-4 text-white">
          Brief information:
        </label>
        <textarea
          placeholder="Write about yourself"
          value={briefInformationValue}
          onChange={handleChangeBriefInformation}
          className="text-white w-full p-4 h-[150px] bg-ash-600 rounded-xl placeholder:text-sm placeholder:text-ash-400"
        />
      </div>
      <div className="flex items-center">
        <label className="whitespace-nowrap pr-4 text-white">
          Hometown:
        </label>
        <input
          type="text"
          placeholder="Write about yourself"
          value={hometownValue}
          onChange={handleChangeHometown}
          className="text-white w-full p-4 bg-ash-600 rounded-xl placeholder:text-sm placeholder:text-ash-400"
        />
      </div>
      <div className="flex justify-end">
        <button className="w-[100px] h-[30px] bg-ash-600 text-white mt-8 rounded-md">
          Save
        </button>
      </div>
    </div>
  </div>
  )
}

export default EditBriefInfo
