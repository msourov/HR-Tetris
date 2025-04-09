import {
  Button,
  Divider,
  Pill,
  ScrollArea,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import {
  useGetCertificationDetailQuery,
  useApproveCertificationMutation,
  useUpdateCertificationMutation,
  useDeleteCertificationMutation,
} from "../../../../features/api/certificationSlice";
import { IconCheck, IconEdit, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import CertificationDetailSkeleton from "../../../../components/shared/Skeletons/CertificationDetailSkeleton";
import useFormatDate from "../../../../services/utils/useFormatDate";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface CertificationDetailProps {
  uid: string;
  closeModal: () => void;
}

interface ErrorResponse {
  status: number;
  data: { detail: string };
}

const certificationSchema = z.object({
  certification_type: z.string().min(1, "Certification type is required"),
  purpose: z.string().min(1, "Purpose is required"),
});
const CertificationDetail = ({ uid, closeModal }: CertificationDetailProps) => {
  const {
    data: certificationDetail,
    isLoading,
    error,
  } = useGetCertificationDetailQuery({ uid });

  const [approveCertification, { isLoading: isMutating }] =
    useApproveCertificationMutation();
  const [updateCertification, { isLoading: isUpdating }] =
    useUpdateCertificationMutation();
  const [deleteCertification, { isLoading: isDeleting }] =
    useDeleteCertificationMutation();

  const [isEditing, setIsEditing] = useState(false);

  const { formatDate } = useFormatDate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<{
    certification_type: string;
    purpose: string;
  }>({
    resolver: zodResolver(certificationSchema),
  });

  useEffect(() => {
    if (certificationDetail?.data) {
      reset({
        certification_type: certificationDetail.data.certification_type || "",
        purpose: certificationDetail.data.purpose || "",
      });
    }
  }, [certificationDetail, reset]);

  const handleEditSubmit = async (formData: {
    certification_type: string;
    purpose: string;
  }) => {
    try {
      if (!certificationDetail?.data?.uid) {
        throw new Error("Certification UID is missing.");
      }
      const payload = {
        uid: certificationDetail.data.uid,
        ...formData,
        active: certificationDetail.data.is_active,
      };
      const response = await updateCertification(payload).unwrap();

      notifications.show({
        title: "Success!",
        message: response.message || "Certification updated successfully.",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse)?.data?.detail ||
          "Failed to update certification. Please try again.",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteCertification = async () => {
    if (!certificationDetail?.data?.uid) {
      notifications.show({
        title: "Error!",
        message: "Certification UID is missing.",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
      return;
    }
    try {
      const response = await deleteCertification({
        uid: certificationDetail.data.uid,
      }).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Certification deleted successfully.",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      closeModal();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse)?.data?.detail ||
          "Failed to delete certification. Please try again.",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

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
          message: "Failed to update certification. Please try again.",
          icon: <IconX />,
          color: "red",
          autoClose: 3000,
        });
      }
    }
  };

  if (isLoading) {
    return <CertificationDetailSkeleton />;
  }

  if (error) {
    return <>Error loading certification details.</>;
  }

  return (
    <div className="pb-4 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-4">
        <h1 className="text-xl font-bold text-orange-400 mb-6 text-center">
          Certification Details
        </h1>
        <form onSubmit={handleSubmit(handleEditSubmit)}>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-[200px_1fr] gap-4">
              <div className="text-gray-500 font-medium">Certification:</div>
              <div className="text-gray-800">
                {certificationDetail?.data?.uid}
              </div>

              <div className="text-gray-500 font-medium">EID:</div>
              <div className="text-gray-800">
                {certificationDetail?.data?.employee_id}
              </div>

              <div className="text-gray-500 font-medium">Type:</div>
              {isEditing ? (
                <TextInput
                  variant="filled"
                  {...register("certification_type")}
                  error={errors.certification_type?.message?.toString()}
                />
              ) : (
                <Text className="text-fuchsia-600 border w-fit px-2 bg-fuchsia-100 rounded-xl text-sm">
                  {certificationDetail?.data?.certification_type || "N/A"}
                </Text>
              )}

              <div className="text-gray-500 font-medium">Purpose:</div>
              {isEditing ? (
                <Textarea
                  variant="filled"
                  autosize
                  minRows={2}
                  maxRows={10}
                  {...register("purpose")}
                  error={errors.purpose?.message?.toString()}
                />
              ) : (
                <Text className="bg-gray-100 p-2 text-sm">
                  {certificationDetail?.data?.purpose || "N/A"}
                </Text>
              )}

              <div className="text-gray-500 font-medium">Applied:</div>
              <div className="text-gray-800">
                <p className="text-amber-600 text-sm font-mono">
                  {formatDate(certificationDetail?.data?.apply_date)}
                </p>
              </div>

              <div className="text-gray-500 font-medium">Approval:</div>
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

            <div className="mt-4 pt-4">
              <Divider
                my="xs"
                label={<p className="text-lg text-blue-400">Logs</p>}
                labelPosition="center"
              />
              <ScrollArea.Autosize mah={220} className="space-y-4">
                {Array.isArray(certificationDetail?.data?.logs) ? (
                  certificationDetail?.data?.logs.map((log, index) => (
                    <div
                      key={index}
                      className="group relative px-4 py-2 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 ease-out mb-2"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon Container */}
                        <div className="flex flex-col items-center pt-1">
                          <div className="p-2 bg-blue-50 rounded-full">
                            <svg
                              className="w-5 h-5 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {log.message}
                          </p>

                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900">
                              {log.admin}
                            </span>
                          </div>

                          {/* Status Indicator */}
                          <div className="absolute top-4 right-4 flex items-center gap-1">
                            <span className="text-xs font-mono text-amber-600">
                              {formatDate(log.create_at, true)}
                            </span>
                            {/* <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                          </span>
                          <span className="text-xs text-gray-500">
                            Completed
                          </span> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <li className="text-center py-6 text-gray-500">
                    No activity logs available
                  </li>
                )}
              </ScrollArea.Autosize>
            </div>
          </div>
          <div className="mt-6 space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              {/* Created At */}
              <div className="flex items-center gap-2 text-gray-500">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="font-medium">Created:</span>
              </div>
              <span className="text-gray-700 font-mono">
                {formatDate(certificationDetail?.data?.create_at, true)}
              </span>

              {/* Updated At */}
              <div className="flex items-center gap-2 text-gray-500">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span className="font-medium">Updated:</span>
              </div>
              <span className="text-gray-700 font-mono">
                {formatDate(certificationDetail?.data?.update_at, true)}
              </span>
            </div>
          </div>
          {certificationDetail?.data?.is_approved === "pending" ? (
            <div className="flex gap-2 my-8 float-right">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    color="gray"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="filled"
                    color="blue"
                    loading={isUpdating}
                    disabled={isUpdating}
                  >
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
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
                  <Button
                    variant="outline"
                    color="blue"
                    className="w-[80px] text-sm"
                    onClick={closeModal}
                  >
                    Close
                  </Button>
                  <Button
                    variant="subtle"
                    color="yellow"
                    leftSection={<IconEdit size={18} />}
                    onClick={() => setIsEditing((prev) => !prev)}
                    className="absolute top-8 right-8 "
                  >
                    Edit
                  </Button>
                </>
              )}
            </div>
          ) : (
            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="filled"
                color="red"
                className="w-[80px] text-sm"
                onClick={handleDeleteCertification}
                disabled={isDeleting}
              >
                Delete
              </Button>
              <Button
                variant="outline"
                color="blue"
                className="w-[80px] text-sm"
                onClick={closeModal}
              >
                Close
              </Button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default CertificationDetail;
