import { Divider, Menu, Text } from "@mantine/core";
import { LuLogOut } from "react-icons/lu";
import { RiSettings2Line } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
// import "../../styles.css";
import { useLocation, useNavigate } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getImageUrl } from "../../services/utils/getImageUrl";
import { logout } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { IconBellFilled } from "@tabler/icons-react";
import CardGlass from "../ui/CardGlass";

const Topbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pathname } = useLocation();
  const mobile = localStorage.getItem("userId") ?? "";

  return (
    <div className="bg-white text-black px-6 flex justify-between items-center border-b-2 relative">
      <div className="relative">
        <div className="logo-container min-h-14">
          <img src="/assets/logo.jpg" alt="logo" width="140" />
          {/* <div className="glowing-ball"></div> */}
        </div>
      </div>

      <div className="flex gap-4 mr-8">
        <Menu transitionProps={{ transition: "rotate-right", duration: 150 }}>
          <Menu.Target>
            <div className="relative m-auto cursor-pointer">
              <IconBellFilled size={24} />
              <span className="absolute -bottom-[2px] -right-[2px] w-[8px] h-[8px] bg-green-500 rounded-full border border-white" />
            </div>
          </Menu.Target>
          <Menu.Dropdown className="shadow-none bg-transparent border-none p-0">
            <CardGlass className="w-[260px] p-4">
              <div className="flex flex-col gap-2 text-sm text-gray-700">
                <Text fw={600}>Notifications</Text>
                <Divider />
                <Text>No new notifications</Text>
              </div>
            </CardGlass>
          </Menu.Dropdown>
        </Menu>

        <Menu transitionProps={{ transition: "rotate-right", duration: 150 }}>
          <Menu.Target>
            <button>
              <LazyLoadImage
                src={`${getImageUrl(mobile)}?t=${Date.now()}`}
                alt="Profile Picture"
                effect="blur"
                className="w-9 h-9 object-cover rounded-full"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src = "/assets/profile-picture.png";
                }}
              />
            </button>
          </Menu.Target>
          <Menu.Dropdown className="bg-white shadow-md rounded-lg text-xs">
            <div className="w-[160px]">
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
                onClick={() => dispatch(logout())}
                className="cursor-pointer text-red-500 hover:bg-red-100"
              >
                Logout
              </Menu.Item>
            </div>
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
