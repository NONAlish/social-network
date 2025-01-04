import { useNavigate } from "react-router-dom";


const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-[50px] bg-ash-300 font-semibold px-[10%] flex justify-center">
      <ul className="flex items-center justify-between w-full">
        <li className="cursore-pointer"><button onClick={() => navigate('/')}>Header</button></li>
        <li className="cursore-pointer"><button onClick={() => navigate('/profile')}>Profile</button></li>
      </ul>
    </div>
  );
};

export default Header;
