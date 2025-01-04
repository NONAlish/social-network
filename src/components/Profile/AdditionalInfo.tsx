import humburger from "../../assets/icons/ui/burger-list-menu-navigation.svg";
import at from "../../assets/icons/ui/at-symbol.svg";
import gift from "../../assets/icons/ui/gift.svg"

interface Data {
  name: string;
  username: string;
  datу_of_birth: string;
  information: boolean;
  text: string;
}

interface AdditionalInfoProps {
  data: Data;
  closeModal: () => void;
}

const AdditionalInfo: React.FC<AdditionalInfoProps> = ({
  closeModal,
  data,
}) => {
  return (
    <div className="fixed inset-0 bg-ash-800 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-ash-800 text-white px-6 pb-6 rounded-lg w-[800px] relative">
        <button
          onClick={closeModal}
          className="text-ash-600 absolute top-4 right-4 hover:text-white"
        >
          ✕
        </button>
        <p className="text-2xl py-4">Additional info</p>
        <div className="bg-ash-700 w-full h-auto rounded-lg p-4">
          <div className="flex items-center py-4">
            <img src={humburger} alt="humburger" className="self-start mr-4" />
            <p>{data.text}</p>
          </div>
          <div className="flex items-center py-4">
            <img src={at} alt="humburger" className="self-start mr-4" />
            <p>{data.username}</p>
          </div>
          <hr className="my-4" />
          <div className="flex items-center py-4">
            <img src={gift} alt="humburger" className="self-start mr-4" />
            <p>{data.datу_of_birth}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdditionalInfo;
