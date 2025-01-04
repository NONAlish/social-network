import SideBar from "../../components/Main/SideBar";
import Header from "../../components/Main/Header";
import { Outlet } from "react-router-dom";

const Main = () => {
  return (
    <div className="bg-ash-200 min-h-screen">
      <Header />
      <div className="mx-[15%] flex my-[2rem] h-full">
        <SideBar />
        <div className="flex-grow ml-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;
