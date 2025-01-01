import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../shared/PageHeader";
import { Button } from "@mantine/core";
import { IoMdReturnLeft } from "react-icons/io";

type PageHeaderProps = {
  Operation?: string;
  Heading?: string;
  Breadcrumb?: {
    module: string;
    page: string;
  };
};

const AppPageHeader: React.FC<PageHeaderProps> = ({
  Operation = "Add",
  Heading,
  Breadcrumb,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split("/");
  const pageType = ["add", "edit", "attendance"].includes(
    path[path.length - 1].split("-")[0]
  );

  if (pageType)
    return (
      // <Button
      //   variant="outline"
      //   size="compact-md"
      //   leftSection={<BiArrowBack />}
      //   my={20}
      //   w={100}
      //   ml={30}
      //   color="blue"
      //   className="shadow-md"
      //   onClick={() => navigate(-1)}
      // >
      //   Back
      // </Button>
      <Button
        variant="outline"
        color="black"
        size="compact-sm"
        mt={20}
        ml={30}
        leftSection={<IoMdReturnLeft size={16} color="gray" />}
        onClick={() => navigate(-1)}
        className="text-gray-600 hover:bg-gray-200"
      >
        Back
      </Button>
    );
  return (
    <PageHeader
      Operation={Operation}
      Heading={Heading}
      Breadcrumb={Breadcrumb}
    />
  );
};

export default AppPageHeader;
