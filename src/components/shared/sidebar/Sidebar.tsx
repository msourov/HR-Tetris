import { Group, Box, UnstyledButton, Accordion, Divider } from "@mantine/core";
import { GrUserManager } from "react-icons/gr";
import { IconHome2 } from "@tabler/icons-react";

// import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { IoPeopleOutline, IoTicketOutline } from "react-icons/io5";
import { MdOutlineAccountBalance, MdOutlineInventory2 } from "react-icons/md";
import { TfiAnnouncement } from "react-icons/tfi";
import { PiCertificate } from "react-icons/pi";
import { LuMailbox } from "react-icons/lu";
// import { ProfileSection } from "../../../pages/ProfileSection";
import classes from "./NavbarLinksGroup.module.css";

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
  isSingleGroup?: boolean;
  icon?: React.ReactNode;
}

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

const sidebarData = [
  {
    title: "Admin",
    icon: <GrUserManager />,
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
    items: [
      {
        label: "Company",
        link: "/company",
      },
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
    ],
  },
  {
    title: "Employee",
    icon: <IoPeopleOutline />,
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
    title: "Accounts",
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
        label: "Candidates",
        link: "/candidates",
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
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentPath = location.pathname;

    setActiveLink(currentPath);
  }, [location]);
  const handleLinkClick = (link: string) => {
    setActiveLink(link);
    navigate(link);
  };

  const isGroupActive = (groupItems: Item[]) =>
    groupItems.some((item: Item) => item.link === activeLink);

  return (
    <Box
      m="0"
      p="0"
      className="overflow-y-auto h-[100vh] flex flex-col w-[15vw] bg-[#102041] min-w-10"
      style={{ minWidth: "150px" }}
    >
      <UnstyledButton
        onClick={() => handleLinkClick("/")}
        classNames={classes}
        style={{
          // backgroundColor:
          //   activeLink === "/" ? "var(--mantine-color-green-1)" : "white",
          color: activeLink === "/" ? "var(--mantine-color-green-5)" : "white",
          fontSize: "0.8rem",
          fontWeight: 700,
          paddingBlock: "0.75rem",
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
      <Divider />
      <Accordion
        transitionDuration={500}
        variant="filled"
        classNames={{ label: classes.label }}
        style={{}}
      >
        {sidebarData.map((group, index) => (
          <Box key={index}>
            {group.items.length === 1 ? (
              <LinksGroup
                key={group.items[0].label}
                label={group.items[0].label}
                isActive={activeLink === group.items[0].link}
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
                  className={`${
                    isGroupActive(group.items) ? "activeGroup" : ""
                  }`}
                >
                  {group?.title}
                </Accordion.Control>
                <Accordion.Panel key={`sub${index}`}>
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
            )}
          </Box>
        ))}
      </Accordion>
    </Box>
  );
}

{
  /* <Accordion.Item
            key={index}
            value={group?.title}
            className={classes.customAccordionItem}
          >
            <Accordion.Control
              style={{
                fontSize: "0.85rem",
                fontWeight: "700 !important",
                transform: "translateY(-2px)",
                color: isGroupActive(group.items)
                  ? "var(--mantine-color-green-9) "
                  : "",
              }}
              icon={group?.icon}
              className={`${isGroupActive(group.items) ? "activeGroup" : ""}`}
            >
              {group?.title}
            </Accordion.Control>
            <Accordion.Panel key={`sub${index}`}>
            [comment start]
              {group?.items.map((item) => ( 
                <LinksGroup
                  key={item?.label}
                  label={item?.label}
                  isActive={activeLink === item?.link}
                  onClick={() => handleLinkClick(item?.link)}
                />
              ))}
              [comment end]
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
          </Accordion.Item> */
}
