import { NavLink } from "react-router-dom";

interface side_bar {
  id: number;
  name: string;
  path: string;
}
const SideBar: React.FC = () => {
  const side_bar_data: side_bar[] = [
    { id: 1, name: "Profile", path: "/profile" },
    { id: 2, name: "Messenger", path: "/messenger" },
    { id: 3, name: "Marathons", path: "/marathons" },
    { id: 4, name: "Settings", path: "/settings" },
  ];
  return (
    <div className="w-[200px] h-full bg-ash-500 rounded-md mr-6 flex-shrink-0">
      <ul className="px-6 py-8">
        {side_bar_data.map((item) => (
          <NavLink
            to={item.path}
            key={item.id}
            className={({ isActive }) =>
              `${isActive ? "bg-white text-white" : "bg-ash-400 text-gray-800"} font-medium hover:bg-ash-300`
            }
          >
            <p className="cursor-pointer my-4">{item.name}</p>
          </NavLink>
        ))}
      </ul>
    </div>
  );
};

export default SideBar;
