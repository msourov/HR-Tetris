import {
  Button,
  Divider,
  Loader,
  ScrollArea,
  Text,
  Textarea,
  Timeline,
} from "@mantine/core";
import { IconCheck, IconEdit, IconUser, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import useFormatDate from "../../../../services/utils/useFormatDate";
import {
  useApproveHomeOfficeMutation,
  useDeleteHomeOfficeMutation,
  useGetHomeOfficeDetailQuery,
  useUpdateHomeOfficeMutation,
} from "../../../../features/api/homeOfficeSlice";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DatePickerInput } from "@mantine/dates";
import { IoCalendar } from "react-icons/io5";
import AppApprovalStatus from "../../../../components/core/AppApprovalStatus";

interface HomeOfficeDetailProps {
  uid: string;
  closeModal: () => void;
}

interface ErrorResponse {
  status: number;
  data: { detail: string };
}

const homeOfficeSchema = z
  .object({
    purpose: z.string().min(1, "Purpose is required"),
    home_office_start_date: z.date({
      required_error: "Start date is required",
    }),
    home_office_end_date: z.date({ required_error: "End date is required" }),
  })
  .refine((data) => data.home_office_end_date > data.home_office_start_date, {
    message: "End date must be later than start date",
    path: ["home_office_end_date"],
  });

const HomeOfficeDetail = ({ uid, closeModal }: HomeOfficeDetailProps) => {
  const {
    data: homeOfficeDetail,
    isLoading,
    error,
    refetch,
  } = useGetHomeOfficeDetailQuery({ uid });

  const [approveHomeOffice, { isLoading: isMutating }] =
    useApproveHomeOfficeMutation();
  const [updateHomeOffice, { isLoading: isUpdating }] =
    useUpdateHomeOfficeMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [deleteHomeOffice, { isLoading: deleteLoading }] =
    useDeleteHomeOfficeMutation();

  const { formatDate } = useFormatDate();

  const singleHomeOfficeData = homeOfficeDetail?.data
    ? Array.isArray(homeOfficeDetail.data)
      ? homeOfficeDetail.data[0]
      : homeOfficeDetail.data
    : null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<{
    purpose: string;
    home_office_start_date: Date;
    home_office_end_date: Date;
  }>({
    resolver: zodResolver(homeOfficeSchema),
  });

  useEffect(() => {
    reset({
      purpose: singleHomeOfficeData?.purpose,
      home_office_start_date: new Date(
        singleHomeOfficeData?.home_office_start_date
      ),
      home_office_end_date: new Date(
        singleHomeOfficeData?.home_office_end_date
      ),
    });
  }, [homeOfficeDetail, reset]);

  const handleApproval = async (
    isApproved: "approved" | "rejected",
    rejectPurpose = ""
  ) => {
    try {
      const response = await approveHomeOffice({
        uid,
        is_approved: isApproved,
        reject_purpose: rejectPurpose,
      }).unwrap();
      notifications.show({
        title: "Success!",
        message:
          response.message || "Home Office Request Approved Successfully",
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
            "Failed to approve home office request. Please try again.",
          icon: <IconX />,
          color: "red",
          autoClose: 3000,
        });
      } else {
        notifications.show({
          title: "Error!",
          message: "Failed to update home office request. Please try again.",
          icon: <IconX />,
          color: "red",
          autoClose: 3000,
        });
      }
    }
  };

  const handleEditSubmit = async (formData: {
    purpose: string;
    home_office_start_date: Date;
    home_office_end_date: Date;
  }) => {
    try {
      const payload = {
        ...formData,
        uid,
        employee_id: singleHomeOfficeData?.employee_id,
        home_office_start_date: formData.home_office_start_date.toISOString(),
        home_office_end_date: formData.home_office_end_date.toISOString(),
      };
      const response = await updateHomeOffice(payload).unwrap();
      notifications.show({
        title: "Success!",
        message: response.message || "Home Office Request Updated Successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse)?.data?.detail ||
          "Failed to update home office request. Please try again.",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const handleDeleteHomeOffice = async () => {
    try {
      const response = await deleteHomeOffice({
        id: singleHomeOfficeData.uid,
      }).unwrap();
      console.log(response);
      notifications.show({
        title: "Success!",
        message: response.message || "Leave deleted successfully",
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
          "An error occurred while deleting leave",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center">
        <Loader type="dots" />
      </div>
    );
  }

  if (error) {
    return <>Error loading home office details.</>;
  }

  console.log(singleHomeOfficeData);

  return (
    <div className="pb-4 px-5">
      <div className="max-w-4xl mx-auto bg-white rounded-lg p-4">
        <h1 className="text-xl font-bold text-orange-400 mb-6 text-center">
          Home Office Details
        </h1>
        <form onSubmit={handleSubmit(handleEditSubmit)}>
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-[200px_1fr] gap-4">
              {/* Request ID */}
              <div className="text-gray-500 font-medium">Request ID:</div>
              <div className="text-gray-800">{homeOfficeDetail?.data?.uid}</div>

              {/* Employee ID */}
              <div className="text-gray-500 font-medium">EID:</div>
              <div className="text-gray-800">
                {homeOfficeDetail?.data?.employee_id}
              </div>

              {/* Purpose */}
              <div className="text-gray-500 font-medium">Purpose:</div>
              {/* {isEditing ? ( */}
              <Textarea
                variant="filled"
                autosize
                minRows={2}
                maxRows={10}
                {...register("purpose")}
                readOnly={!isEditing}
                error={errors.purpose?.message?.toString()}
              />
              {/* ) : (
                <Text>{homeOfficeDetail?.data?.purpose || "N/A"}</Text>
              )} */}

              {/* Start Date */}
              <div className="text-gray-500 font-medium">Start Date:</div>
              {isEditing ? (
                <DatePickerInput
                  variant="filled"
                  leftSection={<IoCalendar size={18} />}
                  value={watch("home_office_start_date")}
                  onChange={(date) =>
                    setValue("home_office_start_date", date || new Date(), {
                      shouldValidate: true,
                    })
                  }
                  error={errors.home_office_start_date?.message?.toString()}
                />
              ) : (
                <div className="text-gray-800">
                  <p className="text-amber-600 text-sm font-mono flex items-center gap-2">
                    <span>
                      <IoCalendar />
                    </span>
                    {formatDate(homeOfficeDetail?.data?.home_office_start_date)}
                  </p>
                </div>
              )}

              {/* End Date */}
              <div className="text-gray-500 font-medium">End Date:</div>
              {isEditing ? (
                <DatePickerInput
                  variant="filled"
                  leftSection={<IoCalendar size={18} />}
                  value={watch("home_office_end_date")}
                  onChange={(date) =>
                    setValue("home_office_end_date", date || new Date(), {
                      shouldValidate: true,
                    })
                  }
                  error={errors.home_office_end_date?.message?.toString()}
                />
              ) : (
                <div className="text-gray-800">
                  <p className="text-amber-600 text-sm font-mono flex items-center gap-2">
                    <span>
                      <IoCalendar />
                    </span>
                    {formatDate(homeOfficeDetail?.data?.home_office_end_date)}
                  </p>
                </div>
              )}

              {/* Approval Status */}
              <div className="text-gray-500 font-medium">Approval:</div>
              <div className="text-gray-800 capitalize">
                <AppApprovalStatus
                  status={homeOfficeDetail?.data?.is_approved || ""}
                />
              </div>
            </div>

            {/* Logs Section */}
            <div className="mt-4 pt-4">
              <Divider
                my="xs"
                label={<p className="text-lg text-blue-400">Logs</p>}
                labelPosition="center"
              />
              <ScrollArea.Autosize mah={220} className="space-y-4">
                {homeOfficeDetail?.data?.logs ? (
                  <>
                    <Divider label="Activity Log" labelPosition="left" />
                    <Timeline active={1} bulletSize={24} lineWidth={2} mt={10}>
                      {Array.isArray(homeOfficeDetail.data.logs) ? (
                        homeOfficeDetail.data.logs.map((log, index) => (
                          <Timeline.Item
                            key={index}
                            bullet={<IconUser size={12} />}
                            title={`Created by ${log.admin}`}
                          >
                            <Text c="dimmed" size="sm">
                              {log.message}
                            </Text>
                            <Text
                              size="sm"
                              mt={4}
                              className="font-mono  text-blue-400"
                            >
                              {formatDate(log.create_at, true)}
                            </Text>
                          </Timeline.Item>
                        ))
                      ) : (
                        <Timeline.Item
                          bullet={<IconUser size={12} />}
                          title={`Created by ${homeOfficeDetail.data.logs.admin}`}
                        >
                          <Text c="dimmed" size="sm">
                            {homeOfficeDetail.data.logs.message}
                          </Text>
                          <Text
                            size="sm"
                            mt={4}
                            className="font-mono  text-blue-400"
                          >
                            {formatDate(
                              homeOfficeDetail.data.logs.create_at,
                              true
                            )}
                          </Text>
                        </Timeline.Item>
                      )}
                    </Timeline>
                  </>
                ) : (
                  <li className="text-center py-6 text-gray-500">
                    No activity logs available
                  </li>
                )}
              </ScrollArea.Autosize>
            </div>
          </div>

          {/* Created and Updated At Section */}
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
                {formatDate(homeOfficeDetail?.data?.create_at, true)}
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
                {formatDate(homeOfficeDetail?.data?.update_at, true)}
              </span>
            </div>
          </div>

          {/* Buttons */}
          {homeOfficeDetail?.data?.is_approved === "pending" ? (
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
                    variant="filled"
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
                onClick={handleDeleteHomeOffice}
                disabled={deleteLoading}
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

export default HomeOfficeDetail;
