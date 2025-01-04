import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reduxjs/toolkit/query";
import { useParams } from "react-router-dom";
import { addMessage, removeMessage } from "../../../redux/messageSlice";
import { useState, useEffect, useRef } from "react";
import InfoModal from "./InfoModal";
import ChatHeader from "../ChatHeader";
import DeleteMenu from "../DeleteMenu";

interface Message {
  sender: string;
  text: string;
  timestamp: string;
  id: number;
}

interface Chat {
  user: {
    name: string;
    avatar: string;
  };
  messages: Message[];
}

const ChatMessages = () => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState<string>(""); // Input value for typing messages
  const [currentChat, setCurrentChat] = useState<Chat | null>(null); // Holds the current chat data
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false); // Manages modal visibility
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null); // Stores the ID of the message to delete
  const [isLongText, setIsLongText] = useState<boolean[]>([]); // Tracks if each message text exceeds width

  const { chatId } = useParams(); // Gets the current chat ID from the URL
  const chats = useSelector((state: RootState) => state.messages.chats); // Retrieves chats from the Redux store
  const chat = chatId && chats[parseInt(chatId) - 1];

  if (!chat) {
    // Display a loading message if the chat data is not available
    return <div>Loading...</div>;
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Dispatches an action to add a new message to the chat
      dispatch(
        addMessage({
          chatId: parseInt(chatId),
          message: {
            id: Date.now(),
            sender: "me",
            text: inputValue.trim(),
            timestamp,
          },
        })
      );
      setInputValue(""); // Clears the input field
    }
  };

  const handleGiveInfo = () => {
    setCurrentChat(chat); // Sets the current chat data
    setIsModalOpen(true); // Opens the modal
  };

  const closeModal = () => {
    setIsModalOpen(false); // Closes the modal
  };

  const handleDeleteMessage = (messageId: number) => {
    // Dispatches an action to remove a message
    dispatch(removeMessage({ chatId: parseInt(chatId), messageId }));
    setMessageToDelete(null); // Resets the selected message to delete
  };

  const handleShowDeleteMenu = (messageId: number) => {
    // Sets the ID of the message to delete, triggering the delete menu
    setMessageToDelete(messageId);
  };

  const handleHideDeleteMenu = () => {
    // Hides the delete menu
    setMessageToDelete(null);
  };

  const messageRefs = useRef<(HTMLDivElement | null)[]>([]); // Ref for each message

  useEffect(() => {
    const handleResize = () => {
      if (messageRefs.current) {
        messageRefs.current.forEach((messageRef, index) => {
          if (messageRef) {
            const isLongText = messageRef.scrollWidth > 300;
            setIsLongText((prev) => {
              const newIsLongText = [...prev];
              newIsLongText[index] = isLongText;
              return newIsLongText;
            });
          }
        });
      }
    };

    // Check on component mount and resize events
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize); // Cleanup event listener
    };
  }, [chatId]); // Recalculate on chatId change or resize

  return (
    <div className="flex flex-col h-full">
      {/* Заголовок чата */}
      <div className="flex-none top-0 z-10">
        <ChatHeader
          avatar={chat.user.avatar}
          name={chat.user.name}
          onInfoClick={handleGiveInfo}
        />
        <hr />
      </div>

      {/* Прокручиваемая область сообщений */}
      <div className="flex-grow overflow-y-auto">
        {/* Отображение сообщений */}
        {chat.messages.map((message: Message, index: number) => (
          <div className="flex justify-start w-full" key={index}>
            <div
              ref={(el) => (messageRefs.current[index] = el)}
              className={`relative p-2 m-2 flex flex-col ${
                message.sender === "me" ? "ml-auto items-end" : "items-start"
              } bg-ash-700 text-white rounded-md max-w-[300px] flex-shrink-0`}
              onContextMenu={(e) => {
                e.preventDefault();
                handleShowDeleteMenu(message.id);
              }}
            >
              <div className="flex flex-col">
                <p
                  className={`pr-2 whitespace-normal overflow-hidden ${
                    isLongText[index] ? "break-all" : "break-words"
                  }`}
                >
                  {message.text}
                </p>
              </div>

              <span className="text-ash-100 text-xs mt-1 ml-auto">
                {message.timestamp}
              </span>

              {/* Меню удаления для сообщения */}
              {messageToDelete === message.id && (
                <DeleteMenu
                  onDelete={() => handleDeleteMessage(message.id)}
                  onClose={handleHideDeleteMenu}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Поле ввода сообщений */}
      <div className="w-full bg-ash-400 flex justify-center items-center p-4">
        <input
          type="text"
          className="h-[30px] w-full max-w-[500px] rounded-md border border-gray-300 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
          placeholder="Type something..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Модальное окно с информацией */}
      {isModalOpen && currentChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xs mx-auto shadow-lg text-center transform transition-transform duration-300 ease-in-out">
            <InfoModal chat={currentChat} />
            <div className="absolute top-4 right-4">
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center text-white bg-red-500 rounded-full hover:bg-red-600"
              >
                X
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
