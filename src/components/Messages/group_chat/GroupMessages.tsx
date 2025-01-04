import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "@reduxjs/toolkit/query";
import GroupMessagesHeader from "./GroupMessagesHeader";
import { addMessage, removeMessage } from "../../../redux/messageSlice";
import { useState, useEffect, useRef } from "react";
import DeleteMenu from "../DeleteMenu";

// Define the types for the message and group
interface Message {
  id: number; // Добавлено свойство id
  sender: string;
  username: string;
  text: string;
  timestamp: string;
}

interface User {
  userId: number;
  avatar: string;
  name: string;
  username: string;
}

interface Group {
  name: string;
  avatar: string;
}

interface Chat {
  chatId: number;
  group: Group;
  users: User[];
  messages: Message[];
}

const GroupMessages: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const dispatch = useDispatch();
  const chats = useSelector((state: RootState) => state.messages.chats);

  const [inputValue, setInputValue] = useState<string>("");
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null); // For delete menu

  const chat = chats.find((chat: Chat) => chat.chatId.toString() === chatId);

  // Ссылка на контейнер с сообщениями
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Прокручиваем контейнер вниз каждый раз, когда добавляется новое сообщение
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat?.messages]); // Этот useEffect сработает при изменении списка сообщений

  if (!chats) {
    return <p>Loading chats...</p>;
  }

  if (!chat) {
    return <p>Chat not found</p>;
  }

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      dispatch(
        addMessage({
          chatId: chat.chatId,
          message: {
            sender: "me",
            username: "myUsername",
            text: inputValue.trim(),
            timestamp,
          },
        })
      );
      setInputValue("");
    }
  };

  const handleDeleteMessage = (messageId: number) => {
    dispatch(removeMessage({ chatId: parseInt(chatId!), messageId }));
    setMessageToDelete(null);
  };

  const handleShowDeleteMenu = (messageId: number) => {
    setMessageToDelete(messageId);
  };

  const handleHideDeleteMenu = () => {
    setMessageToDelete(null);
  };

  const getUserAvatar = (username: string): string | undefined => {
    const user = chat.users.find((user: User) => user.username === username);
    return user ? user.avatar : undefined;
  };

  return (
    <div className="flex flex-col h-full">
      <GroupMessagesHeader chat={chat} />
      <hr />
      <div className="flex-grow overflow-y-auto">
        {chat.messages.map((message: Message, index: number) => (
          <div
            className="flex justify-start w-full cursor-pointer"
            key={index}
            onContextMenu={(event) => {handleShowDeleteMenu(message.id, event);  event.preventDefault();}
            }
          >
            <div
              className={`relative p-2 m-2 flex flex-col ${
                message.sender === "me" ? "ml-auto items-end" : "items-start"
              } bg-ash-700 text-white rounded-md max-w-[300px] flex-shrink-0`}
            >
              <div className="flex flex-col">
                <div
                  className={`${
                    message.sender === "me" ? "hidden" : "block"
                  } pb-4`}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    {message.sender !== "me" && (
                      <img
                        src={
                          getUserAvatar(message.username) ||
                          "default-avatar.png"
                        }
                        alt={message.username}
                        className="w-8 h-8 rounded-full"
                      />
                    )}
                    <p>{message.username}</p>
                  </div>
                  <hr />
                </div>
                <p className="whitespace-normal overflow-hidden break-words">
                  {message.text}
                </p>
              </div>
              <span className="text-ash-100 text-xs mt-1 ml-auto">
                {message.timestamp}
              </span>
              {messageToDelete === message.id && (
                <DeleteMenu
                  onDelete={() => handleDeleteMessage(message.id)}
                  onClose={handleHideDeleteMenu}
                />
              )}
            </div>
          </div>
        ))}
        {/* Ссылка для прокрутки вниз */}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full bg-ash-400 flex justify-center items-center p-4">
        <input
          type="text"
          className="h-[30px] w-full max-w-[500px] rounded-md border border-gray-300 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
          placeholder="Type something..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
      </div>
    </div>
  );
};

export default GroupMessages;
