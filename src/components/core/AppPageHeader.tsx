import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../shared/PageHeader";
import { IoMdReturnLeft } from "react-icons/io";

type PageHeaderProps = {
  Operation?: string;
  Heading?: string;
  Breadcrumb?: {
    module: string;
    page: string;
  };
  ShowAddButton?: boolean;
};

const AppPageHeader: React.FC<PageHeaderProps> = ({
  Operation = "Add",
  Heading,
  Breadcrumb,
  ShowAddButton = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/");
  const showBackButtonOnly = [
    "add",
    "edit",
    "attendance",
    "home-office",
    "detail",
  ].includes(path[path.length - 1].split("-")[0]);

  if (showBackButtonOnly)
    return (
      // <Button
      //   variant="outline"
      //   color="black"
      //   size="compact-xs"
      //   ml={30}
      //   w={"80px"}
      //   leftSection={<IoMdReturnLeft size={16} color="gray" />}
      //   onClick={() => navigate(-1)}
      //   className="text-gray-600 hover:bg-gray-200 my-4 p-0"
      // >
      //   Back
      // </Button>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center shadow-md bg-white justify-center gap-1 border border-white/20 text-gray-600 hover:bg-gray-200 rounded py-[4px] text-xs ml-[30px] w-[65px] my-6"
      >
        <IoMdReturnLeft size={16} color="gray" />
        Back
      </button>
    );
  return (
    <PageHeader
      Operation={Operation}
      Heading={Heading}
      Breadcrumb={Breadcrumb}
      ShowAddButton={ShowAddButton}
    />
  );
};

export default AppPageHeader;
