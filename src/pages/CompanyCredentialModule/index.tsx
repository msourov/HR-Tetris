import { Outlet } from "react-router-dom";
import AppPageHeader from "../../components/core/AppPageHeader";
import CreateCredentialModal from "./AddCLM.tsx";

const CompanyCredentialLayout = () => {
  return (
    <div className="w-[95%] lg:w-[90%] h-[calc(90vh-80px)] flex flex-col mx-auto rounded-lg drop-shadow-lg">
      <div className="flex justify-between">
        <AppPageHeader
          Heading="Credential"
          Breadcrumb={{
            module: "Credential Management",
            page: "Credentials",
          }}
          ShowAddButton={false}
        />
        <div className="mt-8">
          <CreateCredentialModal />
        </div>
      </div>
      <Outlet />;
    </div>
  );
};

export default CompanyCredentialLayout;
