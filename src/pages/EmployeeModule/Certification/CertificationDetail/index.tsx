import { useParams } from "react-router-dom";
import { useGetCertificationDetailQuery } from "../../../../features/api/certificationSlice";

const CertificationDetail = () => {
  const { id: uid } = useParams();

  const {
    data: certificationDetail,
    isLoading,
    error,
  } = useGetCertificationDetailQuery({ uid });

  const formatDate = (dateString: string | undefined): string =>
    dateString ? new Date(dateString).toLocaleDateString() : "N/A";

  const formatDateTime = (dateString: string | undefined): string =>
    dateString ? new Date(dateString).toLocaleString() : "N/A";

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading certification details.</div>;
  }

  return (
    <div className="py-10 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Certification Details
        </h1>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-gray-600 font-medium">Certification ID:</div>
            <div className="text-gray-800">
              {certificationDetail?.data?.uid}
            </div>

            <div className="text-gray-600 font-medium">Employee ID:</div>
            <div className="text-gray-800">
              {certificationDetail?.data?.employee_id}
            </div>

            <div className="text-gray-600 font-medium">Purpose:</div>
            <div className="text-gray-800">
              {certificationDetail?.data?.purpose || "N/A"}
            </div>

            <div className="text-gray-600 font-medium">Certification Type:</div>
            <div className="text-gray-800">
              {certificationDetail?.data?.certification_type || "N/A"}
            </div>

            <div className="text-gray-600 font-medium">Apply Date:</div>
            <div className="text-gray-800">
              {formatDate(certificationDetail?.data?.apply_date)}
            </div>

            <div className="text-gray-600 font-medium">Status:</div>
            <div
              className={`text-gray-800 ${
                certificationDetail?.data?.is_active
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {certificationDetail?.data?.is_active ? "Active" : "Inactive"}
            </div>

            <div className="text-gray-600 font-medium">Approval:</div>
            <div className="text-gray-800 capitalize">
              {certificationDetail?.data?.is_approved}
            </div>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Logs</h2>
            <ul className="space-y-3">
              {certificationDetail?.data?.logs.map((log, index) => (
                <li key={index} className="p-3 bg-gray-50 rounded-lg shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Admin:</span>
                    <span className="text-gray-800">{log.admin}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">Message:</span>
                    <span className="text-gray-800">{log.message}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-medium">
                      Created At:
                    </span>
                    <span className="text-gray-800">
                      {formatDateTime(log.create_at)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-500">
          <div className="flex justify-between">
            <span>Created At:</span>
            <span>{formatDateTime(certificationDetail?.data?.create_at)}</span>
          </div>
          <div className="flex justify-between">
            <span>Updated At:</span>
            <span>{formatDateTime(certificationDetail?.data?.update_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificationDetail;
