import { Outlet } from "react-router-dom";
import AppPageHeader from "../../components/core/AppPageHeader";

const InventoryLayout = () => {
  return (
    <div className="flex flex-col">
      <AppPageHeader
        Heading="Loan"
        Breadcrumb={{ module: "Inventory Management", page: "Loan" }}
        ShowAddButton={false}
      />
      <div className="w-[95%] mb-8 mx-auto max-h-fit bg-white rounded-lg drop-shadow-lg flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default InventoryLayout;
