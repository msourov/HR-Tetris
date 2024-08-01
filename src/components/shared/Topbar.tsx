import { Menu } from "@mantine/core";
import { IconUserFilled } from "@tabler/icons-react";
import { LuLogOut } from "react-icons/lu";
import { useAuth } from "../../services/auth/useAuth";
// import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const { logout } = useAuth();
  // const navigate = useNavigate();
  return (
    <div className="bg-white text-black py-4 px-6 flex justify-between items-center border-b-2">
      <div>{/* <img src="/static/glue.png" alt="logo" width={100} /> */}</div>
      <div className="flex gap-4 mr-8">
        <Menu transitionProps={{ transition: "rotate-right", duration: 150 }}>
          <Menu.Target>
            <button>
              <IconUserFilled color="black" stroke={1} />
            </button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item leftSection={<LuLogOut />}>
              <button onClick={() => logout()}>Logout</button>
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
