import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: number;
  sender: User | string; // sender can be either a User object or a string (e.g., "me" or "them")
  username?: string;
  text: string;
  timestamp: string; // You can use a string for the timestamp, or a Date object for more flexibility
}

interface LastMessage {
  text: string;
  date: string;
}

interface User {
  userId: number;
  avatar: string;
  name?: string;
  username?: string; // Optional field to represent the username for users in group chats
  lastseen?: string; // Added the 'lastseen' field to represent the last seen time
}

interface Group {
  name: string;
  avatar: string;
  participantsCount: number; // The number of participants in the group
  admins: {
    userId: number;
  }[];
}

interface Chat {
  chatId: number;
  user?: User; // For individual chats
  group?: Group; // For group chats
  users?: User[]; // For group chats, this represents the users in the group
  lastMessage: LastMessage;
  messages: Message[];
}

interface MessageState {
  chats: Chat[];
}

const initialState: MessageState = {
  chats: [
    {
      chatId: 1,
      user: {
        avatar:
          "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp",
        name: "Alisher",
        userId: 1,
        lastseen: "20:21",
      },
      lastMessage: {
        text: "Me too!",
        date: "20:33",
      },
      messages: [
        { id: 1, sender: "me", text: "Hello", timestamp: "20:21" },
        { id: 2, sender: "them", text: "Hi! How are you?", timestamp: "20:22" },
      ],
    },
    {
      chatId: 2,
      user: {
        avatar:
          "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp",
        name: "John Doe",
        userId: 2,
        lastseen: "20:20", // Added lastseen
      },
      lastMessage: {
        text: "How are you?",
        date: "20:20",
      },
      messages: [
        { id: 1, sender: "them", text: "How are you?", timestamp: "13:00" },
        {
          id: 2,
          sender: "me",
          text: "I'm good, thanks! How about you?",
          timestamp: "13:05",
        },
      ],
    },
    {
      chatId: 3,
      group: {
        name: "Weekend Plans",
        avatar:
          "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp",
        participantsCount: 3,
        admins: [],
      },

      users: [
        {
          userId: 1,
          avatar:
            "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp",
          username: "Alisher",
          lastseen: "20:20",
        },
        {
          userId: 2,
          avatar:
            "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp",
          username: "JaneDoe",
          lastseen: "20:20",
        },
        {
          userId: 3,
          avatar:
            "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp",
          username: "JaneSmith",
          lastseen: "20:20",
        },
      ],
      lastMessage: {
        text: "Great! See you all there!",
        date: "20:55",
      },
      messages: [
        {
          id: 1,
          sender: "me",
          username: "me",
          text: "Hey everyone! Are we still on for the weekend?",
          timestamp: "20:30",
        },
        {
          id: 2,
          sender: "them",
          username: "JaneSmith",
          text: "Yes, I’m in! What time are we meeting?",
          timestamp: "20:31",
        },
        {
          id: 3,
          sender: "them",
          username: "JaneDoe",
          text: "Yes, I’m in!?",
          timestamp: "20:32",
        },
      ],
    },
  ],
};

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (
      state,
      action: PayloadAction<{ chatId: number; message: Message }>
    ) => {
      const { chatId, message } = action.payload;
      const chat = state.chats.find((c) => c.chatId === chatId);
      if (chat) {
        chat.messages.push(message);
        chat.lastMessage.text = message.text;
        chat.lastMessage.date = message.timestamp;
      }
    },

    removeMessage: (
      state,
      action: PayloadAction<{ chatId: number; messageId: number }>
    ) => {
      const { chatId, messageId } = action.payload;
      const chat = state.chats.find((c) => c.chatId === chatId);
      if (chat) {
        chat.messages = chat.messages.filter(
          (message) => message.id !== messageId
        );
        // Optionally, update last message after deletion
        if (chat.messages.length > 0) {
          chat.lastMessage = {
            text: chat.messages[chat.messages.length - 1].text,
            date: chat.messages[chat.messages.length - 1].timestamp,
          };
        } else {
          chat.lastMessage = { text: "", date: "" }; // Reset if no messages left
        }
      }
    },

    addAdmin: (state, action: PayloadAction<{ chatId: number; newAdminId: number }>) => {
      const { chatId, newAdminId } = action.payload;
      const chat = state.chats.find((c) => c.chatId === chatId);
    
      if (chat) {
        if (chat.group) {
          // Ищем нового администратора в списке пользователей чата
          const newAdmin = chat.users?.find((user) => user.userId === newAdminId);
    
          if (newAdmin) {
            // Добавляем нового администратора в массив admins, не изменяя username
            if (
              !chat.group.admins.some((admin) => admin.userId === newAdmin.userId)
            ) {
              const updatedGroup = {
                ...chat.group,
                admins: [...chat.group.admins, { userId: newAdmin.userId }],
              };
    
              const updatedChat = {
                ...chat,
                group: updatedGroup,
              };
    
              // Обновляем чаты в состоянии
              state.chats = state.chats.map((c) =>
                c.chatId === chatId ? updatedChat : c
              );
            } else {
              console.warn("User is already an admin!");
            }
          } else {
            console.warn("User not found in the group!");
          }
        } else {
          console.warn("No group found in this chat!");
        }
      } else {
        console.warn("Chat not found!");
      }
    },
    

    removeUserFromGroup: (
      state,
      action: PayloadAction<{ chatId: number; userId: number }>
    ) => {
      const { chatId, userId } = action.payload;
      const chat = state.chats.find((c) => c.chatId === chatId);

      if (chat?.group) {
        chat.users = chat.users?.filter((user) => user.userId !== userId); // Убираем пользователя из списка

        // Если удалён текущий админ
        if (chat.group.admins.userId === userId) {
          const newAdmin = chat.users?.[0];
          if (newAdmin) {
            chat.group.admin = {
              userId: newAdmin.userId,
              username: newAdmin.username || "",
              avatar: newAdmin.avatar,
            };
          }
        }
      }
    },
  },
});

export const { addMessage, removeMessage, addAdmin, removeUserFromGroup } =
  messageSlice.actions;
export default messageSlice.reducer;
