import { Group, Box, UnstyledButton, Accordion, Divider } from "@mantine/core";
import { GrUserManager } from "react-icons/gr";
import { IconHome2 } from "@tabler/icons-react";
import classes from "./NavbarLinksGroup.module.css";
// import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { IoPeopleOutline, IoTicketOutline } from "react-icons/io5";
import { MdOutlineAccountBalance, MdOutlineInventory2 } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { PiCertificate } from "react-icons/pi";
import { LuMailbox } from "react-icons/lu";
// import { ProfileSection } from "../../../pages/ProfileSection";

interface IconProps {
  // Add specific prop types here based on the Icon component's documentation
  className?: string;
}

interface LinksGroupProps {
  key: string;
  label: string;
  isActive: boolean;
  link?: string;
  onClick: () => void;
}

export function LinksGroup({
  label,
  isActive,
  onClick,
}: // link,
LinksGroupProps & { isActive: boolean; onClick: () => void }) {
  // const navigate = useNavigate();
  const handleClick: () => void = () => {
    // if (link) {
    //   navigate(link);
    // }
    onClick();
  };
  // console.log(activeLink);
  return (
    <>
      <UnstyledButton
        className={`${classes.control} ${isActive ? classes.active : ""}`}
        onClick={handleClick}
      >
        <Group justify="space-between" gap={0}>
          <Box style={{ display: "flex", alignItems: "center" }}>
            {/* <ThemeIcon size={30} className="bg-white text-black" /> */}
            {/* <Icon style={{ width: rem(18), height: rem(18) }} /> */}
            <Box ml="md">{label}</Box>
          </Box>
        </Group>
      </UnstyledButton>
    </>
  );
}

const sidebarData = [
  {
    title: "Admin",
    icon: <GrUserManager />,
    items: [
      {
        label: "Role",

        link: "/role",
      },
      {
        label: "User",
        link: "/user",
      },
    ],
  },
  {
    title: "Office",
    icon: <HiOutlineOfficeBuilding />,
    items: [
      {
        label: "Department",

        link: "/department",
      },
      {
        label: "Designation",
        link: "/designation",
      },
      {
        label: "Policy",
        link: "/policy",
      },
      {
        label: "Holiday",
        link: "/holiday",
      },
      {
        label: "Shift & Schedule",
        link: "/shift_schedule",
      },
    ],
  },
  {
    title: "Employee",
    icon: <IoPeopleOutline />,
    items: [
      {
        label: "Employee List",

        link: "/employee-list",
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
        link: "/certification",
      },
      {
        label: "Overtime",
        link: "/overtime",
      },
      {
        label: "Home Office",
        link: "/home-office",
      },
    ],
  },
  {
    title: "Inventory",
    icon: <MdOutlineInventory2 />,
    items: [
      {
        label: "Issued Equipment",
        link: "/issued-equipment",
      },
      {
        label: "Tangible",
        link: "/tangible",
      },
      {
        label: "Consumable",
        link: "/consumable",
      },
    ],
  },
  {
    title: "Account",
    icon: <MdOutlineAccountBalance />,
    items: [
      {
        label: "Accounts",
        link: "/account",
      },
      {
        label: "Payroll",
        link: "/payroll",
      },
    ],
  },
  {
    title: "Announcement",
    icon: <TfiAnnouncement />,
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
    items: [
      {
        label: "Candidate",
        link: "/candidate",
      },
    ],
  },
  {
    title: "Certification and License Management",
    icon: <PiCertificate />,
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

  const navigate = useNavigate();
  // const location = useLocation();

  // useEffect(() => {
  //   const currentPath = location.pathname;

  //   setActiveLink(currentPath);
  // }, [location]);
  console.log(activeLink);

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    navigate(link);
  };

  const isGroupActive = (groupItems: Item[]) =>
    groupItems.some((item: Item) => item.link === activeLink);
  console.log(isGroupActive);

  return (
    <Box m="0" p="0" className="overflow-y-auto h-full flex flex-col w-[15vw]">
      <UnstyledButton
        onClick={() => handleLinkClick("/")}
        classNames={classes}
        style={{
          // backgroundColor:
          //   activeLink === "/" ? "var(--mantine-color-green-1)" : "white",
          color:
            activeLink === "/"
              ? "var(--mantine-color-green-9)"
              : "var(--mantine-color-gray-6)",
          fontSize: "1rem",
          fontWeight: 600,
          paddingBlock: "0.75rem",
          borderRadius: "1rem",
          display: "flex",
          paddingLeft: "1rem",
          marginInline: "1rem",
          alignItems: "center",
          ":hover": {
            backgroundColor: "var(--mantine-color-dark-6)",
          },
          ":active": {
            backgroundColor: "var(--mantine-color-dark-7)",
            color: "#ffffff",
            borderRadius: "0.5rem",
            transition: "background-color 0.3s ease, color 0.3s ease",
          },
        }}
      >
        <IconHome2 style={{ marginRight: "8px" }} />
        <span>Dashboard</span>
      </UnstyledButton>
      <Divider />
      <Accordion transitionDuration={500}>
        {sidebarData.map((group, index) => (
          <Accordion.Item
            key={index}
            value={group?.title}
            className={classes.customAccordionItem}
          >
            <Accordion.Control
              style={{
                fontSize: 16,
                transform: "translateY(-2px)",
                color: isGroupActive(group.items)
                  ? "var(--mantine-color-green-9) "
                  : "",
              }}
              icon={group?.icon}
              className={`${classes.customAccordionControl} ${
                isGroupActive(group.items) ? "activeGroup" : ""
              }`}
            >
              {group?.title}
            </Accordion.Control>
            <Accordion.Panel key={`sub${index}`}>
              {/* {group?.items.map((item) => (
                <LinksGroup
                  key={item?.label}
                  label={item?.label}
                  isActive={activeLink === item?.link}
                  onClick={() => handleLinkClick(item?.link)}
                />
              ))} */}
              {group.items.map((item) => (
                <Box key={item.label} className={classes.submenuItem}>
                  <LinksGroup
                    key={item.label}
                    label={item.label}
                    isActive={activeLink === item.link}
                    onClick={() => handleLinkClick(item.link)}
                  />
                </Box>
              ))}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
    </Box>
  );
}
