import React from "react";
import { NavLink } from "react-router-dom";

interface Navbar {
  id: number;
  name: string;
  path: string;
}

const AuthHeader: React.FC = () => {
  const menuItems: Navbar[] = [
    { id: 1, name: "SING IN", path: "/singin" },
    { id: 2, name: "SING UP", path: "/singup" },
  ];

  return (
    <div>
      <ul className="mb-6 text-2xl font-semibold text-white flex">
        {menuItems.map((menuItem) => (
          <li key={menuItem.id} className="mr-6 cursor-pointer">
            <NavLink
              to={`/auth${menuItem.path}`}
              className={({ isActive }) =>
                `cursor-pointer ${isActive} ? "text-yellow-500": "text-white"`
              }
            >
              <h2>{menuItem.name}</h2>
              <div
                className={`w-full h-1 rounded-md ${
                  window.location.pathname.includes(menuItem.path)
                    ? "bg-yellow-500"
                    : ""
                }`}
              ></div>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AuthHeader;
