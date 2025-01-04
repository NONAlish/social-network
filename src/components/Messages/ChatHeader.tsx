import React from "react";

interface ChatHeaderProps {
  avatar: string;
  name: string;
  onInfoClick: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ avatar, name, onInfoClick }) => {
  return (
    <div className="h-[60px] p-2 bg-gray-450 rounded-lg text-white flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <img
          className="w-[50px] h-[50px] rounded-full"
          src={avatar}
          alt="User Avatar"
        />
        <p>{name}</p>
      </div>
      <p className="mr-6 cursor-pointer" onClick={onInfoClick}>
        Info
      </p>
    </div>
  );
};

export default ChatHeader;
