import { Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { CiEdit } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ErrorResponse } from "react-router-dom";

import {
  FaTag,
  FaDollarSign,
  FaCube,
  FaUserCircle,
  FaCalendarAlt,
} from "react-icons/fa";
import React from "react";
import useFormatDate from "../../../../services/utils/useFormatDate";
import { useDeleteTangibleMutation } from "../../../../features/api/tangibleInventorySlice";
import TangibleUpdate from "../TangibleUpdate";

// Removed employee deletion mutation since this is for consumables
// import { useDeleteEmployeeMutation } from "../../../../features/api/employeeSlice";

interface TangibleActionProp {
  data: {
    uid: string;
    name: string;
    descriptions: string;
    price: number;
    quantity: number;
    active: boolean;
    buyer_id: string;
    buyer_at: string | null;
    extension: string;
    logs?: { message: string; create_at: string; admin: string }[];
  };
}

const TangibleActions: React.FC<TangibleActionProp> = ({ data }) => {
  const [viewModalOpened, { open: openView, close: closeView }] =
    useDisclosure(false);
  const [editModalOpened, { open: openEdit, close: closeEdit }] =
    useDisclosure(false);
  const [deleteModalOpened, { open: openDelete, close: closeDelete }] =
    useDisclosure(false);
  const [deleteTangible, { isLoading: deleteLoading, error }] =
    useDeleteTangibleMutation();
  const { formatDate } = useFormatDate();

  const handleDelete = async () => {
    try {
      const response = await deleteTangible({ uid: data.uid }).unwrap();
      console.log(response);
      notifications.show({
        title: "Deleted",
        message: response.message || "Tangible deleted successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error",
        message:
          (error as ErrorResponse).data.detail || "Couldn't delete Tangible",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };

  console.error(error);

  return (
    <>
      <div className="flex items-center gap-2 text-gray-600">
        <button
          onClick={openView}
          className="text-blue-400 transition-all duration-300 hover:text-blue-500 hover:drop-shadow-[0_0_8px_#3b82f6]"
        >
          <IoEyeOutline className="w-5 h-5" />
        </button>
        <button
          onClick={openEdit}
          className="text-yellow-600 transition-all duration-300 hover:text-orange-800 hover:drop-shadow-[0_0_8px_#facc15]"
        >
          <CiEdit className="w-5 h-5" />
        </button>
        <button
          onClick={openDelete}
          className="text-red-600 transition-all duration-300 hover:text-red-500 hover:drop-shadow-[0_0_8px_#ef4444]"
        >
          <MdDeleteOutline className="w-5 h-5" />
        </button>
      </div>

      {/* View Modal */}
      <Modal
        opened={viewModalOpened}
        onClose={closeView}
        size="xl"
        overlayProps={{ blur: 3 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
          {/* Header Section – full width */}
          <div className="col-span-full bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="bg-white p-3 rounded-full shadow-sm">
                <FaTag className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">
                  {data.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  {data.descriptions || "No description available"}
                </p>
              </div>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FaDollarSign className="h-5 w-5 text-green-600" />
              <h3 className="text-sm font-semibold text-gray-600">Pricing</h3>
            </div>
            <DetailItem
              label="Price"
              value={`$${Number(data.price).toFixed(2)}`}
              valueClassName="text-2xl font-bold text-green-700"
            />
          </div>

          {/* Inventory Card */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FaCube className="h-5 w-5 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-600">Inventory</h3>
            </div>
            <div className="space-y-2">
              <DetailItem
                label="Quantity"
                value={data.quantity}
                valueClassName={`text-2xl font-bold ${
                  data.quantity < 10 ? "text-red-600" : "text-gray-800"
                }`}
              />
            </div>
          </div>

          {/* Purchase Information Section */}
          <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <FaUserCircle className="h-5 w-5 text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-600">
                Purchase Information
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <DetailItem
                label="Buyer ID"
                value={data.buyer_id || "N/A"}
                valueClassName="font-mono text-sm text-purple-700"
              />
              <DetailItem
                label="Purchased"
                value={
                  data.buyer_at ? (
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700 text-sm font-mono">
                        {/* {new Date(data.buyer_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })} */}
                        {formatDate(data.buyer_at, true)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400 italic">Not purchased</span>
                  )
                }
              />
            </div>
          </div>

          {/* Activity Log Section – spans full width if present */}
          {/* {data.logs && data.logs.length > 0 && (
            <div className="col-span-full bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">
                Activity Log
              </h3>
              <div className="space-y-3">
                {data.logs.map((log, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="flex-none w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center">
                      <FaUserCircle className="h-4 w-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-800">{log.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(log.create_at).toLocaleString()} by{" "}
                        {log.admin}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )} */}
        </div>
      </Modal>

      <Modal
        opened={editModalOpened}
        withCloseButton={false}
        onClose={closeEdit}
        size="lg"
      >
        <TangibleUpdate uid={data.uid} closeEdit={closeEdit} />
      </Modal>

      {/* Delete Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDelete}
        centered
        withCloseButton={false}
      >
        <p className="text-lg font-thin text-gray-500 mb-4 text-center">
          Are you sure you want to delete this Tangible?
        </p>
        <div className="flex gap-2 justify-center mt-4">
          <Button
            color="red"
            onClick={handleDelete}
            loading={deleteLoading}
            disabled={deleteLoading}
          >
            Confirm
          </Button>
          <Button
            color="gray"
            onClick={closeDelete}
            loading={deleteLoading}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactElement;
  labelClassName?: string;
  valueClassName?: string;
}

const DetailItem: React.FC<DetailItemProps> = ({
  label,
  value,
  labelClassName = "text-sm text-gray-500",
  valueClassName = "text-base text-gray-800",
}) => (
  <div className="flex flex-col space-y-1">
    <div className={labelClassName}>{label}</div>
    <div className={valueClassName}>{value}</div>
  </div>
);

export default TangibleActions;
