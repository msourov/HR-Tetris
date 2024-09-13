// import { Button, Group, TextInput, Textarea, Switch } from "@mantine/core";
// import { DatePickerInput, TimeInput } from "@mantine/dates";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { notifications } from "@mantine/notifications";
// import { IconCheck, IconX } from "@tabler/icons-react";

// const schema = z.object({
//   name: z
//     .string()
//     .min(2, { message: "Name should have at least 2 characters" }),
//   active: z.boolean(),
//   regular: z.boolean(),
//   descriptions: z.string().optional(),
//   day_start_time: z.string().nonempty("Start time is required"),
//   day_end_time: z.string().nonempty("End time is required"),
//   off_day: z.string().optional(),
//   date_range: z.date().array().length(2, "Date range is required"),
// });

// type AddShiftType = z.infer<typeof schema>;

// interface AddShiftProps {
//   toggleModal: () => void;
// }

// const AddShift: React.FC<AddShiftProps> = ({ toggleModal }) => {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setValue,
//     watch,
//   } = useForm<AddShiftType>({
//     resolver: zodResolver(schema),
//     defaultValues: {
//       name: "",
//       active: false,
//       regular: false,
//       descriptions: "",
//       day_start_time: "",
//       day_end_time: "",
//       off_day: "",
//       date_range: [],
//     },
//   });

//   const onSubmit = async (data: AddShiftType) => {
//     console.log(data);
//     // Convert date and time to ISO strings
//     const formattedData = {
//       ...data,
//       day_start_time: new Date(data.day_start_time).toISOString(),
//       day_end_time: new Date(data.day_end_time).toISOString(),
//       start_time: data.date_range[0].toISOString(),
//       end_time: data.date_range[1].toISOString(),
//     };

//     console.log(formattedData);

//     try {
//       // Call your create shift mutation here with formattedData
//       notifications.show({
//         title: "Success!",
//         message: "Shift created successfully",
//         icon: <IconCheck />,
//         color: "green",
//         autoClose: 3000,
//       });
//       toggleModal();
//       reset();
//     } catch (error) {
//       notifications.show({
//         title: "Error!",
//         message: "Failed to create shift",
//         icon: <IconX />,
//         color: "red",
//         autoClose: 3000,
//       });
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit(onSubmit)}>
//       <TextInput
//         label="Name"
//         {...register("name")}
//         error={errors.name?.message}
//         // required
//       />

//       <Group mt="sm">
//         <Switch
//           label="Active"
//           {...register("active")}
//           error={errors.active?.message}
//         />
//         <Switch
//           label="Regular"
//           {...register("regular")}
//           error={errors.regular?.message}
//         />
//       </Group>

//       <Textarea
//         label="Descriptions"
//         {...register("descriptions")}
//         error={errors.descriptions?.message}
//         mt="sm"
//       />

//       <TimeInput
//         label="Day Start Time"
//         {...register("day_start_time")}
//         error={errors.day_start_time?.message}
//         required
//         mt="sm"
//       />

//       <TimeInput
//         label="Day End Time"
//         {...register("day_end_time")}
//         error={errors.day_end_time?.message}
//         required
//         mt="sm"
//       />

//       <TextInput
//         label="Off Day"
//         {...register("off_day")}
//         error={errors.off_day?.message}
//         // required
//         mt="sm"
//       />

//       <DatePickerInput
//         type="range"
//         label="Pick dates range"
//         placeholder="Pick dates range"
//         value={watch("date_range")}
//         onChange={(value) => setValue("date_range", value)}
//         error={errors.date_range?.message}
//         required
//         mt="sm"
//       />

//       <Group ta="right" mt="md">
//         <Button type="submit">Create Shift</Button>
//       </Group>
//     </form>
//   );
// };

// export default AddShift;
