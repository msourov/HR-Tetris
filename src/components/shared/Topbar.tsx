import { Menu } from "@mantine/core";
import { IconUserFilled } from "@tabler/icons-react";
import { LuLogOut } from "react-icons/lu";
import { useAuth } from "../../services/auth/useAuth";
import { RiSettings2Line } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
// import "../../styles.css";
import { useLocation, useNavigate } from "react-router-dom";

const Topbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <div className="bg-white text-black px-6 flex justify-between items-center border-b-2 relative">
      <div className="relative">
        <div className="logo-container">
          <img src="/assets/logo.jpg" alt="logo" width="140" />
          {/* <div className="glowing-ball"></div> */}
        </div>
      </div>
      <div className="flex gap-4 mr-8">
        <Menu transitionProps={{ transition: "rotate-right", duration: 150 }}>
          <Menu.Target>
            <button>
              <IconUserFilled color="black" stroke={1} />
            </button>
          </Menu.Target>
          <Menu.Dropdown className="bg-white shadow-md rounded-lg text-xs">
            <Menu.Item
              leftSection={<FaRegCircleUser size={16} />}
              onClick={() => navigate("/profile")}
              className={`cursor-pointer ${
                pathname === "/profile" ? "text-blue-500" : "text-gray-500"
              }`}
            >
              Profile
            </Menu.Item>
            <Menu.Item
              leftSection={<RiSettings2Line size={16} />}
              onClick={() => navigate("/settings")}
              className={`cursor-pointer ${
                pathname === "/settings" ? "text-blue-500" : "text-gray-500"
              }`}
            >
              Settings
            </Menu.Item>
            <Menu.Item
              leftSection={<LuLogOut size={16} />}
              onClick={logout}
              className="cursor-pointer text-red-500 hover:bg-red-100"
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        {/* <button onClick={() => navigate("/settings")}>
          <IconSettings color="black" stroke={1} />
        </button> */}
        {/* <button onClick={logout}>
          <IconLogout color="black" stroke={1} />
        </button> */}
      </div>
    </div>
  );
};

export default Topbar;
