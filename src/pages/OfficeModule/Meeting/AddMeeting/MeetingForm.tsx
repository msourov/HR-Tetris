import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  TextInput,
  Textarea,
  Select,
  Switch,
  MultiSelect,
  Button,
  Paper,
  Box,
  Loader,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useEffect } from "react";
import {
  useCreateMeetingMutation,
  useUpdateMeetingMutation,
  useGetMeetingDetailQuery,
} from "../../../../features/api/meetingSlice";
import {
  useGetEmployeeHelperQuery,
  useGetSupervisorOptionsQuery,
} from "../../../../features/api/employeeSlice";
import { MeetingCreatePayload } from "../../../../features/types/meeting";


// Zod Validation Schema
const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    descriptions: z.string(),
    supervisor_id: z.string().min(1, "Supervisor is required"),
    meeting_type: z.enum(["online", "offline"]),
    active: z.boolean(),
    meeting_person: z.array(z.string()).min(1, "Select at least one person"),
    online_link: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]),
    agenda: z.string(),
    location: z.string().optional(),
    meeting_at: z.string().refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      { message: "Invalid date format" }
    ),
  })
  .refine(
    (data) => {
      if (data.meeting_type === "online") {
        return !!data.online_link;
      }
      return true;
    },
    {
      message: "Online link is required for online meetings",
      path: ["online_link"],
    }
  )
  .refine(
    (data) => {
      if (data.meeting_type === "offline") {
        return !!data.location;
      }
      return true;
    },
    {
      message: "Location is required for offline meetings",
      path: ["location"],
    }
  );

type MeetingFormData = z.infer<typeof schema>;

interface MeetingFormProps {
  close: () => void;
  meetingId?: string; // For edit mode
}

const MeetingForm = ({ close, meetingId }: MeetingFormProps) => {
  const isEditMode = Boolean(meetingId);

  // Meeting mutations
  const [createMeeting, { isLoading: isCreating }] = useCreateMeetingMutation();
  const [updateMeeting, { isLoading: isUpdating }] = useUpdateMeetingMutation();
  
  // Fetch meeting details for edit mode
  const {
    data: meetingData,
    isLoading: isLoadingMeeting,
    error: meetingError,
  } = useGetMeetingDetailQuery(
    { uid: meetingId! },
    { skip: !meetingId }
  );
  
  // Fetch supervisors and persons
  const {
    data: supervisors,
    isLoading: loadingSupervisors,
    error: supervisorsError,
  } = useGetSupervisorOptionsQuery();
  
  const {
    data: persons,
    isLoading: loadingPersons,
    error: personsError,
  } = useGetEmployeeHelperQuery();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty },
  } = useForm<MeetingFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      active: true,
      meeting_type: "online",
      priority: "low",
      meeting_person: [],
    },
  });

  // Pre-populate form when meeting data is available (edit mode)
  useEffect(() => {
    if (meetingData) {
      const meeting = meetingData.data;
      reset({
        name: meeting.name,
        descriptions: meeting.descriptions,
        supervisor_id: meeting.supervisor,
        meeting_type: meeting.meeting_type,
        active: meeting.active,
        meeting_person: meeting.meeting_person.map((p) => p.employee_id),
        online_link: meeting.online_link || "",
        priority: meeting.priority,
        agenda: meeting.agenda || "",
        location: meeting.location || "",
        meeting_at: new Date(meeting.meeting_at).toISOString().slice(0, 16),
      });
    }
  }, [meetingData, reset]);

  const onSubmit: SubmitHandler<MeetingFormData> = async (data) => {
    const payload: MeetingCreatePayload = {
      ...data,
      online_link: data.online_link ?? "",
      location: data.location ?? "",
    };

    try {
      if (isEditMode && meetingId) {
        await updateMeeting({
          uid: meetingId,
          ...payload,
        }).unwrap();
        notifications.show({
          title: "Success!",
          message: "Meeting updated successfully",
          icon: <IconCheck size={18} />,
          color: "green",
          autoClose: 3000,
        });
      } else {
        await createMeeting(payload).unwrap();
        notifications.show({
          title: "Success!",
          message: "Meeting created successfully",
          icon: <IconCheck size={18} />,
          color: "green",
          autoClose: 3000,
        });
      }
      close();
    } catch (err) {
      notifications.show({
        title: "Error!",
        message: `Failed to ${isEditMode ? "update" : "create"} meeting`,
        icon: <IconX size={18} />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  // Watch meeting type to conditionally render fields
  const meetingType = watch("meeting_type");
  const activeStatus = watch("active");

  // Prepare supervisor options
  const supervisorOptions =
    supervisors?.data.map((supervisor) => ({
      value: supervisor.employee_id,
      label: supervisor.name,
    })) || [];

  // Prepare person options
  const personOptions =
    persons?.data.map((person) => ({
      value: person.employee_id,
      label: person.name,
    })) || [];

  const isLoading = isCreating || isUpdating || loadingSupervisors || loadingPersons || isLoadingMeeting;

  if (supervisorsError || personsError || meetingError) {
    return (
      <div className="text-red-500 text-center py-10">
        Error loading data:{" "}
        {supervisorsError
          ? "Supervisors: " + JSON.stringify(supervisorsError)
          : personsError
          ? "Persons: " + JSON.stringify(personsError)
          : meetingError
          ? "Meeting: " + JSON.stringify(meetingError)
          : "Unknown error"}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader size="lg" />
      </div>
    );
  }

  return (
    <Paper withBorder radius="md" p="xl" className="max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Name Field */}
          <TextInput
            label="Meeting Name"
            required
            {...register("name")}
            error={errors.name?.message}
          />

          {/* Supervisor Field */}
          <Select
            label="Supervisor"
            disabled={loadingSupervisors}
            required
            data={supervisorOptions}
            value={watch("supervisor_id")}
            onChange={(value) => setValue("supervisor_id", value || "")}
            error={errors.supervisor_id?.message}
          />

          {/* Meeting Type */}
          <Select
            label="Meeting Type"
            required
            data={[
              { value: "online", label: "Online" },
              { value: "offline", label: "Offline" },
            ]}
            value={meetingType}
            onChange={(value) =>
              setValue("meeting_type", value as "online" | "offline")
            }
            error={errors.meeting_type?.message}
          />

          {/* Priority */}
          <Select
            label="Priority"
            required
            data={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
            value={watch("priority")}
            onChange={(value) =>
              setValue("priority", value as "low" | "medium" | "high")
            }
            error={errors.priority?.message}
          />

          {/* Online Link (Conditional) */}
          {meetingType === "online" && (
            <TextInput
              label="Online Meeting Link"
              required
              {...register("online_link")}
              error={errors.online_link?.message}
              value={watch("online_link") || ""}
            />
          )}

          {/* Location (Conditional) */}
          {meetingType === "offline" && (
            <TextInput
              label="Location"
              required
              {...register("location")}
              error={errors.location?.message}
              value={watch("location") || ""}
            />
          )}

          {/* Meeting Date/Time */}
          <TextInput
            label="Meeting Date & Time"
            type="datetime-local"
            required
            {...register("meeting_at")}
            error={errors.meeting_at?.message}
          />

          {/* Active Status */}
          <Box>
            <Switch
              color="blue"
              label={activeStatus ? "Active" : "Inactive"}
              checked={activeStatus}
              onChange={(e) => setValue("active", e.currentTarget.checked)}
            />
          </Box>
        </div>

        {/* Participants */}
        <MultiSelect
          label="Participants"
          disabled={loadingPersons}
          required
          data={personOptions}
          value={watch("meeting_person")}
          onChange={(values) => setValue("meeting_person", values)}
          error={errors.meeting_person?.message}
          className="mb-6"
        />

        {/* Agenda */}
        <Textarea
          label="Agenda"
          required
          minRows={3}
          {...register("agenda")}
          error={errors.agenda?.message}
          className="mb-6"
          value={watch("agenda")}
        />

        {/* Description */}
        <Textarea
          label="Description"
          minRows={3}
          {...register("descriptions")}
          error={errors.descriptions?.message}
          className="mb-6"
          value={watch("descriptions")}
        />

        <div className="flex items-center justify-end gap-2">
          <Button
            type="submit"
            color="blue"
            size="compact-md"
            loading={isCreating || isUpdating}
            disabled={isEditMode && !isDirty}
            className="text-sm"
          >
            {isEditMode ? "Update" : "Create"}
          </Button>
          <Button
            variant="outline"
            size="compact-md"
            color="black"
            onClick={close}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Paper>
  );
};

export default MeetingForm;