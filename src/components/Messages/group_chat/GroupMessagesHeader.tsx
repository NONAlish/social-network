import React, { useState } from 'react';
import GroupMessagesInfoModule from './GroupMessagesInfoModule';

interface User {
  userId: number;
  avatar: string;
  name: string;
}

interface GroupMessagesHeaderProps {
  chat: {
    group: {
      name: string;
      avatar: string;
    };
    users: User[];  // Добавили список пользователей
  };
}

const GroupMessagesHeader: React.FC<GroupMessagesHeaderProps> = ({ chat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleInfoGroup() {
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
  }

  return (
    <div>
      <div className="h-[60px] p-2 bg-gray-450 rounded-lg text-white flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            className="w-[50px] h-[50px] rounded-full"
            src={chat.group.avatar}
            alt="Group Avatar"
          />
          <p>{chat.group.name}</p>
        </div>
        <p className="mr-6 cursor-pointer">
          <button onClick={handleInfoGroup}>Info</button>
        </p>
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <GroupMessagesInfoModule
          closeModal={closeModal}
          chatName={chat.group.name}
          users={chat.users} 
          group={chat.group}  
        />
      )}
    </div>
  );
};

export default GroupMessagesHeader;
