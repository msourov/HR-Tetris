import { useLocation } from "react-router-dom";
import PageHeader from "../shared/PageHeader";

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
  const location = useLocation();
  const path = location.pathname.split("/");
  const showBackButton = [
    "add",
    "edit",
    "detail",
  ].includes(path[path.length - 1].split("-")[0]);

  return (
    <PageHeader
      Operation={Operation}
      Heading={Heading}
      Breadcrumb={Breadcrumb}
      ShowAddButton={ShowAddButton}
      showBackButton={showBackButton}
    />
  );
};

export default AppPageHeader;
