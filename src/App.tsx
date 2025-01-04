import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store.ts";
import Auth from "./pages/Auth/Auth";
import SingIn from "./pages/Auth/User/SingIn";
import SingUp from "./pages/Auth/User/SingUp";
import PasswordRecovery from "./components/Auth/PasswordRecovery/PasswordRecovery";
import Profile from "./components/Profile/Profile";
import Main from "./pages/Main/Main";
import EditProfile from "./components/Profile/EditProfile";
import EditAccount from "./components/Profile/EditAccount";
import Messenger from "./pages/Messenger/Messenger";
import ChatMessages from "./components/Messages/one_to_one_chat/ChatMessages.tsx";
import GroupMessages from "./components/Messages/group_chat/GroupMessages.tsx";
import Marathons from "./pages/Marathons/Marathons.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      // Side Bar
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/messenger",
        element: <Messenger />,
        children: [
          {
            path: "group/:chatId/:groupname", // Чат с перепиской (личный чат)
            element: <GroupMessages />
          },
          {
            path: "chat/:chatId/:username", // Личный чат с параметром chatId и username
            element: <ChatMessages />,
          }          
        ],
      },
      {
        path: "/marathons",
        element: <Marathons />,
      },
      {
        path: "/settings",
        element: <Profile />,
      },

      // Edit
      {
        path: "/edit",
        element: <EditProfile />,
      },
      {
        path: "/edit/account",
        element: <EditAccount />,
      },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      {
        path: "singup",
        element: <SingUp />,
      },
      {
        path: "singin",
        element: <SingIn />,
      },
      {
        path: "password_recovery",
        element: <PasswordRecovery />,
      },
    ],
  },
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;


