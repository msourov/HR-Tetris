// import { Box, Button, Drawer, Loader, Menu, Modal, Text } from "@mantine/core";
// import { useDisclosure } from "@mantine/hooks";
// import { BiDotsVerticalRounded } from "react-icons/bi";
// import { CiEdit } from "react-icons/ci";
// import { IoEyeOutline } from "react-icons/io5";
// import { MdDeleteOutline } from "react-icons/md";
// import { useNavigate } from "react-router-dom";
// import { notifications } from "@mantine/notifications";
// import { IconCheck, IconX } from "@tabler/icons-react";
// import ErrorAlert from "../../../../components/shared/ErrorAlert";

// interface EmplyeeActionProp {
//   id: string;
// }

// const OvertimeActions: React.FC<EmplyeeActionProp> = ({ id }) => {
//   const [editOpened, { open: openEdit, close: closeEdit }] =
//     useDisclosure(false);
//   const [deleteModalOpened, { open: openDelete, close: closeDelete }] =
//     useDisclosure(false);
// //   const [deleteEmployee, { isLoading, error }] = useDeleteEmployeeMutation();
//   const navigate = useNavigate();

//   const DeleteEmployee = async () => {
//     console.log(id);
//     try {
//       const response = await deleteEmployee({ id }).unwrap();
//       console.log(response);
//       notifications.show({
//         title: "Success!",
//         message: "Employee Deleted Successfully",
//         icon: <IconCheck />,
//         color: "red",
//         autoClose: 3000,
//       });
//     } catch (error) {
//       console.error(error);
//       notifications.show({
//         title: "Error!",
//         message: "Couldn't delete employee",
//         icon: <IconX />,
//         color: "red",
//         autoClose: 3000,
//       });
//     } finally {
//       closeDelete();
//     }
//   };

//   if (isLoading) {
//     return (
//       <div>
//         <Loader type="dots" />
//       </div>
//     );
//   }

//   if (error) {
//     <ErrorAlert message="Something went wrong!" />;
//   }
//   return (
//     <Box>
//       <Menu transitionProps={{ transition: "rotate-right", duration: 150 }}>
//         <Menu.Target>
//           <button>
//             <BiDotsVerticalRounded />
//           </button>
//         </Menu.Target>
//         <Menu.Dropdown>
//           <Menu.Item
//             leftSection={<IoEyeOutline />}
//             onClick={() => navigate(`${id}/detail`)}
//           >
//             View
//           </Menu.Item>
//           <Menu.Item leftSection={<CiEdit />} onClick={openEdit}>
//             Edit
//           </Menu.Item>
//           <Menu.Item
//             leftSection={<MdDeleteOutline />}
//             className="text-red-600"
//             onClick={openDelete}
//           >
//             Delete
//           </Menu.Item>
//         </Menu.Dropdown>
//       </Menu>
//       <Modal
//         opened={deleteModalOpened}
//         onClose={closeDelete}
//         centered
//         className="text-center"
//       >
//         <Text>Are you sure you want to delete?</Text>
//         <Box className="flex gap-2 justify-center mt-4">
//           <Button color="red" onClick={DeleteEmployee}>
//             Confirm
//           </Button>
//           <Button color="gray" onClick={closeDelete}>
//             Cancel
//           </Button>
//         </Box>
//       </Modal>
//       <Drawer
//         position="right"
//         opened={editOpened}
//         onClose={closeEdit}
//         title="Edit employee"
//       ></Drawer>
//     </Box>
//   );
// };

// export default OvertimeActions;
