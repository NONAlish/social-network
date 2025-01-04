import { useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";

interface User {
  avatar: string;
  name: string;
}

interface Group {
  avatar: string;
  name: string;
}

interface Message {
  text: string;
  date: string;
}

interface Chat {
  chatId: number;
  user?: User;
  group?: Group;
  lastMessage: Message;
}

const ChatList = () => {
  const chats = useSelector((state: RootState) => state.messages.chats);
  const navigate = useNavigate();

  const handleChatClick = (
    chatId: number,
    username?: string,
    groupname?: string
  ) => {
    if (chatId) {
      // Преобразуем groupname или username, если они есть
      if (groupname) {
        const formattedGroupName = groupname.toLowerCase().replace(/\s+/g, "_"); // Заменяем пробелы на подчеркивания и приводим к нижнему регистру
        navigate(`/messenger/group/${chatId}/${formattedGroupName}`);
      } else if (username) {
        const formattedUsername = username.toLowerCase().replace(/\s+/g, "_"); // Заменяем пробелы на подчеркивания и приводим к нижнему регистру
        navigate(`/messenger/chat/${chatId}/${formattedUsername}`);
      }
      console.log(chatId);
    } else {
      console.log("Chat ID is undefined");
    }
  };

  return (
    <div>
      {chats.map((chat: Chat) => (
        <div key={chat.chatId}>
          <div
            className="w-full h-[60px] p-1 bg-gray-450 rounded-lg flex cursor-pointer items-center"
            onClick={
              () =>
                handleChatClick(chat.chatId, chat.user?.name, chat.group?.name) // Передаем username для личного чата и groupname для группового
            }
          >
            {/* Проверка на групповой или личный чат */}
            {chat.group ? (
              <>
                <img
                  src={chat.group.avatar}
                  alt="group-avatar"
                  className="w-14 h-14 rounded-full mr-2"
                />
                <div className="flex-1 min-w-0 max-w-32">
                  <h2
                    className={`text-ash-100 ${chat.group.name.length > 10 ? "text-[14px]" : ""}`}
                  >
                    {chat.group.name.length > 30
                      ? chat.group.name.substring(0, 30) + "..." // Обрезаем имя группы, если оно больше 30 символов
                      : chat.group.name}
                  </h2>
                  <p className="text-xs text-ash-300 overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {chat.lastMessage.text.length > 30
                      ? chat.lastMessage.text.substring(0, 30) + "..." // Обрезаем текст сообщения, если он больше 30 символов
                      : chat.lastMessage.text}
                  </p>
                </div>
              </>
            ) : (
              <>
                <img
                  src={chat.user?.avatar} // безопасный доступ к avatar
                  alt="user-avatar"
                  className="w-14 h-14 rounded-full mr-2"
                />
                <div className="flex-1 min-w-0 max-w-32">
                  <h2 className="text-ash-100">
                    {chat.user?.name?.length && chat.user.name.length > 30 // Проверка на длину имени пользователя
                      ? chat.user.name.substring(0, 30) + "..."
                      : chat.user?.name}
                  </h2>
                  <p className="text-xs text-ash-300 overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {chat.lastMessage.text.length > 30
                      ? chat.lastMessage.text.substring(0, 30) + "..." // Обрезаем текст сообщения, если он больше 30 символов
                      : chat.lastMessage.text}
                  </p>
                </div>
              </>
            )}

            <p className="ml-auto text-xs">{chat.lastMessage.date}</p>
          </div>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default ChatList;
