import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeUserFromGroup, addAdmin } from "../../../redux/messageSlice"; // Import actions

interface User {
  userId: number;
  avatar: string;
  name: string;
  username: string;
  lastseen: string;
}

interface GroupMessagesInfoModuleProps {
  closeModal: () => void; // Function to close the modal
  chatName: string; // Group name
  users: User[]; // List of users
  group: {
    name: string;
    chatId: number;
    avatar: string;
    participantsCount: number;
    admin: {
      userId: number;
      username: string;
      avatar: string;
    };
  };
}

const GroupMessagesInfoModule: React.FC<GroupMessagesInfoModuleProps> = ({
  closeModal,
  chatName,
  users = [],
  group,
}) => {
  const dispatch = useDispatch(); // Get dispatch function

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [usersState, setUsersState] = useState<User[]>(users);

  useEffect(() => {
    setUsersState(users); // Update usersState when users prop changes
  }, [users]);

  useEffect(() => {
    if (group?.admin) {
      console.log("Admin's name: ", group.admin.username);
    }
  }, [group]);

  if (!group) {
    return <div>Загрузка...</div>;
  }

  const handleUserRightClick = (event: React.MouseEvent, user: User) => {
    event.preventDefault(); // Prevent the default context menu
    setSelectedUser(user); // Open the user options panel
  };

  const handleCloseUserOptions = () => {
    setSelectedUser(null); // Close the options panel
  };

  const handleRemoveUser = () => {
    if (selectedUser) {
      dispatch(
        removeUserFromGroup({
          chatId: group.chatId,
          userId: selectedUser.userId,
        })
      );
      setUsersState((prevState) =>
        prevState.filter((user) => user.userId !== selectedUser.userId)
      ); // Обновление списка пользователей
      setSelectedUser(null); // Закрытие панели
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      console.log("Users updated");
      console.log(usersState);
    }
  }, [usersState]);

  const handleMakeAdmin = () => {
    if (selectedUser) {
      // Dispatch action to transfer admin rights with chatId and newAdminId
      dispatch(addAdmin({ chatId: 3, newAdminId: selectedUser.userId }));

      // Обновляем объект группы с новым администратором
      const updatedGroup = {
        ...group,
        group: {
          admin: {
            userId: selectedUser.userId,
          },
        },
      };

      // Обновляем список пользователей, добавляем пометку (Admin) к имени
      setUsersState((prevState) =>
        prevState.map((user) =>
          user.userId === selectedUser.userId
            ? { ...user, username: `${user.username} (Admin)` }
            : user
        )
      );

      // Логируем обновленный объект группы
      console.log("Updated group:", updatedGroup);
      console.log(group);

      // Закрываем панель выбора
      setSelectedUser(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">{chatName} Information</h2>
        <p className="mb-4">This is some information about the group.</p>

        <div className="mb-4">
          <h3 className="text-lg font-semibold">
            Group Members: {usersState.length}
          </h3>
          <div className="flex flex-wrap gap-6 mt-4">
            {usersState.length > 0 ? (
              usersState.map((user) => (
                <div
                  key={user.userId}
                  onContextMenu={(event) => handleUserRightClick(event, user)} // Open the options menu
                  className="flex flex-row items-center space-x-4 p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 w-full max-w-xs cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full border-2 border-gray-300"
                  />
                  <div className="flex flex-col space-y-1">
                    <p className="text-lg font-semibold text-gray-900">
                      {user.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      Last Seen:{" "}
                      <span className="text-gray-700 font-medium">
                        {user.lastseen}
                      </span>
                      {group.admins.some(
                        (admin) => admin.userId === user.userId
                      ) && (
                        <span className="text-sm text-green-500 font-medium ml-2">
                          Admin
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No users available.</p>
            )}
          </div>
        </div>

        <button
          onClick={closeModal}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Close
        </button>
      </div>

      {/* Options panel for the selected user */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-60">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-xs w-full">
            <h3 className="text-lg font-semibold mb-4">
              Options for {selectedUser.username}
            </h3>
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleRemoveUser}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                Remove User
              </button>
              <button
                onClick={handleMakeAdmin}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Make Admin
              </button>
              <button
                onClick={handleCloseUserOptions}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupMessagesInfoModule;
