import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Modal, Select, Textarea, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { Outlet } from "react-router-dom";
import { z } from "zod";
import axios from "axios";
import { getToken } from "../../services/utils/getToken";
import { useGetAllTicketsQuery } from "../../features/api/ticketSlice";
import { useGetEmployeeHelperQuery } from "../../features/api/employeeSlice";
import { IoPersonCircle } from "react-icons/io5";

const ticketSchema = z.object({
  employee_id: z.string().nonempty({ message: "Employee ID is required" }),
  name: z
    .string()
    .min(2, { message: "Name should have at least 2 characters" }),
  type: z.string().nonempty({ message: "Ticket type is required" }),
  message: z.string().nonempty({ message: "Message is required" }),
});

type TicketFormType = z.infer<typeof ticketSchema>;

const TicketLayout = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const { data: employees } = useGetEmployeeHelperQuery();
  const { refetch } = useGetAllTicketsQuery({ page: 1, limit: 10 });

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<TicketFormType>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      employee_id: "",
      name: "",
      type: "",
      message: "",
    },
  });
  const employeeOptions = Array.isArray(employees?.data)
    ? employees?.data.map((item) => ({
        label: item?.name,
        value: item?.uid,
      }))
    : [];

  const onSubmit = async (data: TicketFormType) => {
    const formData = new FormData();
    formData.append("employee_id", data.employee_id);
    formData.append("name", data.name || "");
    formData.append("type", data.type);
    formData.append("message", data.message);
    try {
      const token = getToken();
      const response = await axios.post(
        import.meta.env.VITE_APP_BASE_URL + "tickets/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      notifications.show({
        title: "Success!",
        message: response.data.message,
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
      close();
      reset();
      await refetch();
    } catch (error) {
      console.log(error);
      notifications.show({
        title: "Error!",
        message: "An error occurred while creating the ticket",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  const employeeId = watch("employee_id");

  return (
    <div className="flex flex-col">
      {/* <PageHeader
        Operation="Open A"
        Heading="Ticket"
        Breadcrumb={{ module: "Ticket Management", page: "List" }}
      /> */}
      <Button
        variant="light"
        color="blue"
        className="w-[180px] mx-10 mt-6"
        onClick={open}
      >
        New ticket
      </Button>
      <div className="w-[95%] my-8 mx-auto bg-white rounded-lg drop-shadow-lg flex-1 overflow-auto">
        {/* {data && <RoleTable data={data.data} />} */}
        <Outlet />
      </div>
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <form onSubmit={handleSubmit(onSubmit)} className="pt-2 pb-6 px-6">
          <Select
            label="Employee ID"
            placeholder="Select an employee"
            leftSection={<IoPersonCircle />}
            data={employeeOptions}
            value={employeeId}
            onChange={(value) => {
              if (value) setValue("employee_id", value);
            }}
            error={errors.employee_id?.message as React.ReactNode}
            searchable
          />
          <TextInput
            label="Name"
            {...register("name")}
            error={errors.name?.message}
            mt="sm"
          />
          <TextInput
            label="Type"
            {...register("type")}
            error={errors.type?.message}
            required
            mt="sm"
          />
          <Textarea
            label="Message"
            {...register("message")}
            error={errors.message?.message}
            required
            mt="sm"
          />
          <Button type="submit" mt="md" fullWidth>
            Create Ticket
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default TicketLayout;
