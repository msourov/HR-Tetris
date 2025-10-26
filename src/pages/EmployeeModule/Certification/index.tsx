import AppPageHeader from "../../../components/core/AppPageHeader";
import { Outlet } from "react-router-dom";

const CertificationLayout = () => {
  return (
    <div className="w-[95%] lg:w-[90%] h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg">
      <AppPageHeader
        Heading="Certification"
        Breadcrumb={{
          module: "Employee Management",
          page: "Certifications",
        }}
      />

      <Outlet />
    </div>
  );
};

export default CertificationLayout;
