import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../shared/PageHeader";
import { Button } from "@mantine/core";
import { BiArrowBack } from "react-icons/bi";

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
      <Button
        variant="outline"
        size="compact-md"
        leftSection={<BiArrowBack />}
        mt={20}
        mb={-10}
        w={100}
        ml={30}
        color="blue"
        onClick={() => navigate(-1)}
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
