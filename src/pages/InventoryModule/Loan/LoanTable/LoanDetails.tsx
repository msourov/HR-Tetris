import { Button } from "@mantine/core";
import AppApprovalStatus from "../../../../components/core/AppApprovalStatus";
import { LoanWithGuarantorObj } from "../../../../features/types/inventory";

interface LoanDetailInterface {
  data: LoanWithGuarantorObj;
  closeModal: () => void;
}

const LoanDetails = ({ data, closeModal }: LoanDetailInterface) => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{data.name}</h1>
          <span
            className={`text-sm font-medium ${
              data.active
                ? "text-emerald-600 bg-emerald-100"
                : "text-gray-500 bg-gray-100"
            } px-3 py-1 rounded-full`}
          >
            {data.active ? "Active" : "Inactive"}
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">
            Created: {new Date(data.create_at).toLocaleDateString()}
          </p>
          {/* <p className="text-sm text-gray-500">
            Last Updated: {new Date(data.update_at).toLocaleDateString()}
          </p> */}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gray-500">Loan Amount</p>
          <p className="text-xl font-semibold">
            ৳{data.price.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Quantity</p>
          <p className="text-xl font-semibold">{data.quantity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Category</p>
          <p className="text-xl font-semibold text-blue-600">{data.category}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Approval Status</p>
          <AppApprovalStatus status={data.is_admin_approve} />
        </div>
      </div>

      {/* Description Section */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">Loan Details</h3>
        <p className="text-gray-600 leading-relaxed">{data.descriptions}</p>
      </div>

      {/* People Section */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Employee Card */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={
                data.employee.employee_image || data.employee.employee_name[0]
              }
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
              alt="Employee"
            />
            <div>
              <h4 className="font-semibold text-gray-800">
                {data.employee.employee_name}
              </h4>
              <p className="text-sm text-gray-600">
                {data.employee.employee_designation}
              </p>
              <p className="text-xs text-gray-500">
                {data.employee.employee_department} Department
              </p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-md text-sm text-gray-500">
            Admin Approval -{" "}
            <AppApprovalStatus status={data.is_admin_approve} />
          </div>
        </div>

        {/* Guarantor Card */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={data.guarantor.guarantor_image}
              className="w-12 h-12 rounded-full object-cover border-2 border-white"
              alt="Guarantor"
            />
            <div>
              <h4 className="font-semibold text-gray-800">
                {data.guarantor.guarantor_name}
              </h4>
              <p className="text-sm text-gray-600">
                {data.guarantor.guarantor_designation}
              </p>
              <p className="text-xs text-gray-500">
                {data.guarantor.guarantor_department} Department
              </p>
            </div>
          </div>
          <div className="bg-white p-3 rounded-md text-sm text-gray-500">
            Guarantor Approval -{" "}
            <AppApprovalStatus status={data.is_guarantor_approve} />
          </div>
        </div>
      </div>

      {/* Activity Log */}
      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Activity Log
        </h3>
        <div className="space-y-3">
          {data.logs.map((log, index) => (
            <div className="flex items-center gap-3" key={index}>
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {log.message}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(log.create_at).toLocaleString()} by Admin{" "}
                  {log.admin}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <Button variant="outline" onClick={closeModal}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default LoanDetails;
