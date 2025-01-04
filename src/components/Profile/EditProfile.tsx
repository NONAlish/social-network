import { useState, useRef } from "react";
import EditBriefInfo from "./EditBriefInfo";
import { Link } from "react-router-dom";

interface Data {
  firstName: string;
  lastName: string;
  username: string;
  briefInformation?: string;
  hometown?: string;
}

const EditProfile: React.FC = () => {
  const data_obj: Data = {
    firstName: "Alisher",
    lastName: "Iliyev",
    username: "iliyev13",
    briefInformation: "Hello I'm Alisher and I'm 19 years old",
    hometown: "Almaty",
  };

  const url = "https://vk.com/";

  const [dataObj, setDataObj] = useState(data_obj);

  const [usernameChange, setUsernameChange] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>(dataObj.username);
  const [answer, setAnswer] = useState("Save");

  const ref = useRef<HTMLInputElement>(null);

  function handleChange() {
    setUsernameChange((prev) => !prev);
  }

  function handleUserNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newUserNameWithUrl = e.target.value;

    if (newUserNameWithUrl === dataObj.username) {
      setAnswer("This address is already yours");
    } else if (newUserNameWithUrl.length < 6) {
      setAnswer("This name is too short");
    } else {
      setAnswer("Save");
    }

    setUserName(newUserNameWithUrl);
  }

  function handleSave() {
    if (userName !== dataObj.username) {
      setDataObj((prevDataObj) => ({
        ...prevDataObj,
        username: userName,
      }));
      setUsernameChange(false);
    }
  }
  return (
    <div>
      <div className="w-[800px] min-h-[550px] bg-ash-500 rounded-2xl relative">
        <div className="header h-[64px] bg-ash-600 mb-16 rounded-xl flex items-center pl-6">
          <h3 className="font-normal text-white">Profile</h3>
        </div>

        {/* Круг */}
        <div className="p-6 absolute z-20">
          <div className="w-[200px] h-[200px] rounded-full bg-ash-700"></div>
        </div>

        <div className="header min-h-[300px] bg-ash-600 rounded-xl pl-6 absolute bottom-0 w-full z-5">
          <div className="flex justify-between w-[490px] ml-auto mr-4 border-2 border-gray-500 p-2 text-white mt-12">
            <p>
              {dataObj.firstName} {dataObj.lastName}
            </p>
            <Link to="account" className="cursor-pointer">Edit in SPA ID</Link>
          </div>
          <div className="mt-10 text-ash-400">
            <ul className="flex justify-between">
              <li>Nickname</li>
              {usernameChange ? (
                <div className="flex flex-col relative ml-[60px]">
                  <div className="flex items-center relative mr-4">
                    <span className="absolute left-[12px] top-[51%] transform -translate-y-1/2 text-ash-400">
                      {url}
                    </span>
                    <input
                      type="text"
                      defaultValue={userName}
                      ref={ref}
                      onChange={handleUserNameChange}
                      className="pl-[124px] text-white bg-ash-600 border-2"
                    />
                  </div>
                  <button
                    onClick={handleSave}
                    className="flex items-center h-[40px] items-center mt-[40px] bg-ash-500 text-white rounded-md p-2 pb-4"
                  >
                    {answer}
                  </button>
                </div>
              ) : (
                <li className="flex w-[400px] left-[72px] relative top-[2px] text-ash-400 ">
                  <p>{url}</p>
                  <span className="text-white">{dataObj.username}</span>
                </li>
              )}
              <li className="relative right-6 text-blue-400">
                <button onClick={handleChange}>Edit</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <EditBriefInfo briefInformation={data_obj.briefInformation} hometown={data_obj.hometown} />
    </div>
  );
};

export default EditProfile;
