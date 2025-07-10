import { Group, Box, UnstyledButton, Accordion, Drawer } from "@mantine/core";
import { GrUserManager } from "react-icons/gr";
import { IconArrowLeft, IconHome2 } from "@tabler/icons-react";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { IoPeopleOutline, IoTicketOutline } from "react-icons/io5";
import { MdOutlineAccountBalance, MdOutlineInventory2 } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { PiCertificate } from "react-icons/pi";
import { LuMailbox } from "react-icons/lu";
import { useMediaQuery } from "@mantine/hooks";
import { RiMenu2Fill } from "react-icons/ri";
import classes from "./NavbarLinksGroup.module.css";

interface IconProps {
  className?: string;
}

interface LinksGroupProps {
  key: string;
  label: string;
  isActive: boolean;
  link?: string;
  onClick: () => void;
  isSingleGroup?: boolean;
  icon?: React.ReactNode;
}

type SidebarItem = {
  title: string;
  icon: JSX.Element;
  permissionKey: string;
  items: { label: string; link: string }[];
  visible?: boolean;
};

export function LinksGroup({
  label,
  isActive,
  onClick,
  isSingleGroup = false,
  icon,
}: // link,
LinksGroupProps & { isActive: boolean; onClick: () => void }) {
  const handleClick: () => void = () => {
    onClick();
  };
  return (
    <UnstyledButton
      className={`${classes.control} ${isActive ? classes.active : ""} ${
        isSingleGroup ? classes.singleGroup : ""
      }`}
      onClick={handleClick}
    >
      <Group justify="space-between" gap={0} ml={10}>
        <Box style={{ display: "flex", alignItems: "center" }}>
          {/* <ThemeIcon size={30} className="bg-white text-black" /> */}
          {/* <Icon style={{ width: rem(18), height: rem(18) }} /> */}
          {icon && <Box className="font-bold">{icon}</Box>}
          <Box ml="sm">{label}</Box>
        </Box>
      </Group>
    </UnstyledButton>
  );
}

const initialSidebarData = [
  {
    title: "Admin",
    icon: <GrUserManager />,
    permissionKey: "user_management",
    items: [
      {
        label: "Role",

        link: "/roles",
      },
      {
        label: "User",
        link: "/users",
      },
    ],
  },
  {
    title: "Office",
    icon: <HiOutlineOfficeBuilding />,
    permissionKey: "office_management",
    items: [
      {
        label: "Department",
        link: "/departments",
      },
      {
        label: "Designation",
        link: "/designations",
      },
      {
        label: "Policy",
        link: "/policies",
      },
      {
        label: "Holiday",
        link: "/holidays",
      },
      {
        label: "Shift & Schedule",
        link: "/shift",
      },
      {
        label: "Meetings",
        link: "/meetings",
      },
      {
        label: "Tasks",
        link: "/tasks",
      },
    ],
  },
  {
    title: "Employee",
    icon: <IoPeopleOutline />,
    permissionKey: "employee_management",
    items: [
      {
        label: "Employee List",

        link: "/employees",
      },
      {
        label: "Attendance",
        link: "/attendance",
      },
      {
        label: "Leave",
        link: "/leave",
      },
      {
        label: "Certification",
        link: "/certifications",
      },
      {
        label: "Overtime",
        link: "/overtime",
      },
      {
        label: "Home Office",
        link: "/home-office",
      },
      {
        label: "Category",
        link: "/category",
      },
    ],
  },
  {
    title: "Inventory",
    icon: <MdOutlineInventory2 />,
    permissionKey: "inventory_management",
    items: [
      {
        label: "Issued Equipment",
        link: "/inventory/issued-equipment",
      },
      {
        label: "Tangible",
        link: "/inventory/tangibles",
      },
      {
        label: "Consumable",
        link: "/inventory/consumables",
      },
    ],
  },
  {
    title: "Accounts",
    icon: <MdOutlineAccountBalance />,
    permissionKey: "accounts_management",
    items: [
      // {
      //   label: "Accounts",
      //   link: "/account",
      // },
      {
        label: "Payroll",
        link: "/payroll",
      },
    ],
  },
  {
    title: "Announcement",
    icon: <TfiAnnouncement />,
    permissionKey: "anouncement_management",
    items: [
      {
        label: "Announcement Portal",
        link: "/announcement",
      },
    ],
  },
  {
    title: "Ticket",
    icon: <IoTicketOutline />,
    permissionKey: "ticket_management",
    items: [
      {
        label: "Ticket Portal",
        link: "/ticket",
      },
    ],
  },
  {
    title: "Recruitment",
    icon: <LuMailbox />,
    permissionKey: "recruitment_management",
    items: [
      {
        label: "Candidates",
        link: "/candidates",
      },
    ],
  },
  {
    title: "Certification and License Management",
    icon: <PiCertificate />,
    permissionKey: "clm_management",
    items: [
      {
        label: "Certification and License",
        link: "/certification-and-license",
      },
    ],
  },
];

type Item = {
  label: string;
  link: string;
};

interface Group {
  title: string;
  icon: React.FC<IconProps>;
  items: Item[];
}

export function Sidebar() {
  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [sidebarData, setSidebarData] =
    useState<SidebarItem[]>(initialSidebarData);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 1023px)");

  useEffect(() => {
    const roleData = localStorage.getItem("role");
    const role = roleData ? JSON.parse(roleData) : null;

    const updatedSidebarData = initialSidebarData.map((group) => ({
      ...group,
      visible: role?.[group.permissionKey] === "a" ? true : false,
    }));

    setSidebarData(updatedSidebarData);
  }, []);

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    navigate(link);
    if (isMobile) {
      setIsDrawerOpen(false);
    }
  };

  const isGroupActive = (groupItems: Item[]) => {
    return groupItems.some(
      (item: Item) => item.link === `/${activeLink?.split("/")[1]}`
    );
  };

  const sidebarContent = (
    <Box
      m="0"
      className="overflow-y-auto h-[100%] flex flex-col w-[15vw] bg-[#0f2d53] pb-8"
      style={{ minWidth: "240px" }}
    >
      <UnstyledButton
        onClick={() => handleLinkClick("/")}
        classNames={classes}
        style={{
          color: activeLink === "/" ? "var(--mantine-color-green-5)" : "white",
          fontSize: "0.8rem",
          fontWeight: 700,
          padding: "1rem 1rem 0.5rem 1rem",
          borderRadius: "1rem",
          display: "flex",
          paddingLeft: "1rem",
          marginInline: "1rem",
          alignItems: "center",
          ":hover": {
            backgroundColor: "var(--mantine-color-dark-0)",
          },
          ":active": {
            backgroundColor: "var(--mantine-color-dark-7)",
            color: "#ffffff",
            borderRadius: "0.5rem",
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
        }}
      >
        <IconHome2 style={{ marginRight: "8px", width: "16px" }} />
        <span>Dashboard</span>
      </UnstyledButton>
      <Accordion
        transitionDuration={500}
        variant="filled"
        classNames={{ label: classes.label }}
      >
        {sidebarData
          .filter((group) => group.visible)
          .map((group, index) => (
            <Box key={index}>
              {group.items.length === 1 ? (
                <LinksGroup
                  key={group.items[0].label}
                  label={group.items[0].label}
                  isActive={
                    activeLink?.startsWith(group.items[0].link) ?? false
                  }
                  onClick={() => handleLinkClick(group.items[0].link)}
                  icon={group.icon}
                />
              ) : (
                <Accordion.Item
                  value={group?.title}
                  className={classes.customAccordionItem}
                >
                  <Accordion.Control
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      transform: "translateY(-2px)",
                      color: isGroupActive(group.items)
                        ? "var(--mantine-color-green-9)"
                        : "white",
                    }}
                    icon={group?.icon}
                    className={isGroupActive(group.items) ? "activeGroup" : ""}
                  >
                    {group?.title}
                  </Accordion.Control>
                  <Accordion.Panel key={`sub${index}`}>
                    {group.items.map((item) => (
                      <Box key={item.label} className={classes.submenuItem}>
                        <LinksGroup
                          key={item.label}
                          label={item.label}
                          isActive={activeLink?.startsWith(item.link) ?? false}
                          onClick={() => handleLinkClick(item.link)}
                        />
                      </Box>
                    ))}
                  </Accordion.Panel>
                </Accordion.Item>
              )}
            </Box>
          ))}
      </Accordion>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <div
          onClick={() => setIsDrawerOpen((o) => !o)}
          className="z-50 p-4 cursor-pointer"
        >
          <RiMenu2Fill size={20} />
        </div>
      )}

      {isMobile ? (
        <Drawer
          opened={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          size={240}
          overlayProps={{ opacity: 0.5, blur: 1 }}
          withinPortal
          zIndex={1000}
          withCloseButton={false}
          classNames={{ content: "h-full bg-[#0f2d53]", body: "p-0" }}
          className={classes.body}
          style={{ padding: 0 }}
        >
          <div
            className="flex justify-center bg-white py-3 cursor-pointer"
            onClick={() => setIsDrawerOpen(false)}
          >
            {/* <Button variant="default" className="w-full rounded-none"> */}
            <IconArrowLeft size={20} />
            {/* </Button> */}
          </div>
          <div className="p-0 m-0 h-full w-full">{sidebarContent}</div>
        </Drawer>
      ) : (
        sidebarContent
      )}
    </>
  );
}
