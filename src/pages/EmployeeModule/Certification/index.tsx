import AppPageHeader from "../../../components/core/AppPageHeader";
import { Outlet } from "react-router-dom";

const CertificationLayout = () => {
  return (
    <div className="w-[95%] lg:w-[90%] h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg drop-shadow-lg">
      <AppPageHeader
        Heading="Certification"
        Breadcrumb={{ module: "Certification Management", page: "List" }}
      />
      <div className="w-[95%] mb-8 mx-auto max-h-fit rounded-lg drop-shadow-lg flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default CertificationLayout;
