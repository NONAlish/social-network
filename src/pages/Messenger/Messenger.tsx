import React from "react";
import { Outlet } from "react-router-dom";  // Импортируем Outlet для вложенных маршрутов
import ChatList from "../../components/Messages/ChatList";

const Messenger: React.FC = () => {
  return (
    <div className="w-full h-[calc(100vh-300px)] bg-ash-500 rounded-md border-2 border-ash-700 flex">
      {/* Sidebar with Chat List */}
      <div className="w-[300px] rounded-l-md border-r-2 border-ash-700 h-full flex flex-col">
        <div className="w-full h-[60px] p-2 bg-gray-450 rounded-lg text-white flex items-center justify-center">
          Chats
        </div>
        <hr />
        <div className="flex-grow overflow-y-auto">
          <ChatList />
        </div>
      </div>

      {/* Main chat area with Outlet for nested routes */}
      <div className="w-full h-full flex flex-col">
        <div className="flex-grow overflow-y-auto">
          <Outlet />  {/* Здесь будет отображаться вложенный компонент (например, ChatMessages) */}
        </div>
      </div>
    </div>
  );
};

export default Messenger;
