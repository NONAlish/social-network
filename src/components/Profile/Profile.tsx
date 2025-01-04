import SvgArrow from "../../assets/icons/ui/arrow-next.svg";
import info_circle_outline from "../../assets/icons/ui/info_circle_outline.svg";
import { motion } from "framer-motion";
import AdditionalInfo from "./AdditionalInfo";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Data {
  name: string;
  username: string;
  datу_of_birth: string;
  information: boolean;
  text: string;
}

const Profile: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
  };

  const data: Data = {
    name: "Alisher Iliyev",
    username: "iliyev13",
    datу_of_birth: "13.08.2005",
    information: true,
    text: "Lorem, ipsum dolor sit amet consectetur adipisicing elit.  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ratione distinctio placeat sapiente neque ducimus, corporis ipsum deleniti laudantium, laborum modi facilis ad animi.",
  };

  return (
    <>
      <div className="flex h-auto w-full bg-ash-300 rounded-md font-medium">
        <div className="w-[200px] h-[200px] bg-ash-500 rounded-full ml-4 my-4 relative flex-shrink-0">
          <div className="w-[20px] h-[20px] bg-green-500 rounded-full absolute bottom-5 right-5"></div>
        </div>
        <div className="flex mt-40 mb-4 justify-between flex-grow mx-10">
          <div>
            <h3 className="text-2xl">{data.name}</h3>
            {data.information ? (
              <>
                <p className="font-light">{data.text}</p>
                <button
                  onClick={toggleModal}
                  className="flex text-ash-600 hover:underline space-x-2 mt-4"
                >
                  <img src={info_circle_outline} alt="info_circle_outline" />
                  <span>Learn more</span>
                </button>
              </>
            ) : (
              <div className="w-full font-semibold text-sm cursor-pointer flex items-center text-blue-600">
                <p>
                  <Link to="/edit">Add information about yourself</Link>
                </p>
                <motion.img
                  src={SvgArrow}
                  alt="SvgArrow"
                  className="w-6 h-6"
                  animate={{ x: ["0px", "5px", "0px"] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                />
              </div>
            )}
          </div>
          <button className="bg-ash-500 h-8 px-2 ml-4 mb-6 text-white rounded-md justify-end flex-shrink-0">
            <Link to="/edit">Edit Profile</Link>
          </button>
        </div>
      </div>
      {isModalOpen && <AdditionalInfo closeModal={toggleModal} data={data} />}
    </>
  );
};

export default Profile;
