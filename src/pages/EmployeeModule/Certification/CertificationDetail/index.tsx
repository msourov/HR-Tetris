import { Button, Loader, Pill } from "@mantine/core";
import {
  useGetCertificationDetailQuery,
  useApproveCertificationMutation,
} from "../../../../features/api/certificationSlice";
import { IconCheck, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

interface CertificationDetailProps {
  uid: string;
  closeModal: () => void;
}

interface ErrorResponse {
  status: number;
  data: { detail: string };
}

const CertificationDetail = ({ uid, closeModal }: CertificationDetailProps) => {
  const {
    data: certificationDetail,
    isLoading,
    error,
  } = useGetCertificationDetailQuery({ uid });

  const [approveCertification, { isLoading: isMutating }] =
    useApproveCertificationMutation();

  const formatDate = (dateString: string | undefined): string =>
    dateString ? new Date(dateString).toLocaleDateString() : "N/A";

  const formatDateTime = (dateString: string | undefined): string =>
    dateString ? new Date(dateString).toLocaleString() : "N/A";

  const handleApproval = async (
    isApproved: "approved" | "rejected",
    rejectPurpose = ""
  ) => {
    try {
      const response = await approveCertification({
        uid,
        is_approved: isApproved,
        reject_purpose: rejectPurpose,
      }).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Certification Approved Successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      closeModal();
    } catch (error) {
      console.log(error);
      if (error && typeof error === "object" && "data" in error) {
        notifications.show({
          title: "Error!",
          message:
            (error as ErrorResponse).data?.detail ||
            "Failed to certification. Please try again.",
          icon: <IconX />,
          color: "red",
          autoClose: 3000,
        });
      } else {
        notifications.show({
          title: "Error!",
          message: "Failed to certification. Please try again.",
          icon: <IconX />,
          color: "red",
          autoClose: 3000,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader size="lg" />
      </div>
    );
  }

  if (error) {
    return <div>Error loading certification details.</div>;
  }

  return (
    <div className="pb-10 px-5">
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

            <div className="text-gray-600 font-medium">Approval:</div>
            <div className="text-gray-800 capitalize">
              <Pill
                size="sm"
                c={
                  certificationDetail?.data?.is_approved === "pending"
                    ? "yellow"
                    : certificationDetail?.data?.is_approved === "rejected"
                    ? "red"
                    : "green"
                }
                className={
                  certificationDetail?.data?.is_approved === "pending"
                    ? "bg-yellow-100"
                    : certificationDetail?.data?.is_approved === "rejected"
                    ? "bg-red-200"
                    : "bg-green-200"
                }
              >
                {certificationDetail?.data?.is_approved}
              </Pill>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-4 pt-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Logs</h2>
            <ul className="space-y-3">
              {Array.isArray(certificationDetail?.data?.logs) ? (
                certificationDetail?.data?.logs.map((log, index) => (
                  <li
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg shadow-sm"
                  >
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Admin:</span>
                      <span className="text-gray-800">{log.admin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">
                        Message:
                      </span>
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
                ))
              ) : (
                <li className="text-gray-600">No logs found.</li>
              )}
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
        {certificationDetail?.data?.is_approved === "pending" && (
          <div className="flex gap-2 pt-8 pb-4 float-right">
            <Button
              color="green"
              leftSection={<IconCheck size={20} />}
              onClick={() => handleApproval("approved")}
              loading={isMutating}
            >
              Accept
            </Button>
            <Button
              color="red"
              variant="outline"
              leftSection={<IconX size={20} />}
              onClick={() =>
                handleApproval(
                  "rejected",
                  "Reason for rejection can be provided here."
                )
              }
              loading={isMutating}
            >
              Reject
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CertificationDetail;
