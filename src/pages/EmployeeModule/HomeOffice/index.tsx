import { Outlet } from "react-router-dom";
import AppPageHeader from "../../../components/core/AppPageHeader";

const HomeOfficeLayout = () => {
  return (
    <div className="w-[95%] lg:w-[90%] h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg">
      <AppPageHeader
        Heading="Home Office"
        Breadcrumb={{ module: "Employee Management", page: "Home Office" }}
      />
      <Outlet />
    </div>
  );
};

export default HomeOfficeLayout;
