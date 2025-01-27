import AppPageHeader from "../../../components/core/AppPageHeader";
import { Outlet } from "react-router-dom";

const CertificationLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <AppPageHeader
        Heading="Certification"
        Breadcrumb={{ module: "Certification Management", page: "List" }}
      />
      <div className="w-[95%] mb-8 mx-auto max-h-fit bg-white rounded-lg drop-shadow-lg flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default CertificationLayout;
