import { useEffect } from "react";
import {
  Button,
  Loader,
  NumberInput,
  Textarea,
  TextInput,
} from "@mantine/core";
import { z } from "zod";
import {
  useGetConsumableDetailsQuery,
  useUpdateConsumableMutation,
} from "../../../../features/api/consumableInventorySlice";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { ErrorResponse } from "react-router-dom";

// Schema for updating a consumable
const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  descriptions: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price must be at least 0"),
  quantity: z.coerce.number().min(0, "Quantity must be at least 0"),
  buyer_id: z.string().min(1, "Buyer ID is required"),
  buyer_at: z
    .union([z.string().datetime(), z.null()])
    .optional()
    .transform((val) => (val === "" ? null : val)),
});

type ConsumableUpdateRequest = z.infer<typeof schema>;

interface ConsumableUpdateProps {
  uid: string;
  closeEdit: () => void;
}

const ConsumableUpdate = ({ uid, closeEdit }: ConsumableUpdateProps) => {
  const { data: consumableDetail, isLoading } = useGetConsumableDetailsQuery({
    uid,
  });
  const [updateConsumable, { isLoading: updateLoading }] =
    useUpdateConsumableMutation();

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ConsumableUpdateRequest>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      descriptions: "",
      price: 0,
      quantity: 0,
      buyer_id: "",
      buyer_at: null,
    },
  });
  console.log(consumableDetail);
  if (isLoading) {
    <Loader type="dots" />;
  }

  useEffect(() => {
    if (consumableDetail?.data) {
      reset({
        name: consumableDetail.data.name,
        descriptions: consumableDetail.data.descriptions,
        price: consumableDetail.data.price,
        quantity: consumableDetail.data.quantity,
        buyer_id: consumableDetail.data.buyer_id,
        buyer_at: consumableDetail.data.buyer_at
          ? new Date(consumableDetail.data.buyer_at).toISOString().split("T")[0]
          : null,
      });
    }
  }, [consumableDetail, reset]);

  const onSubmit: SubmitHandler<ConsumableUpdateRequest> = async (data) => {
    console.log(data);
    try {
      const response = await updateConsumable({
        uid,
        ...data,
        buyer_at: data.buyer_at || null,
      }).unwrap();
      console.log(response);
      notifications.show({
        title: "Success!",
        message: response.message || "Consumable updated successfully",
        icon: <IconCheck />,
        color: "green",
        autoClose: 3000,
      });

      closeEdit();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error!",
        message:
          (error as ErrorResponse).data.detail || "Failed to update consumable",
        icon: <IconX />,
        color: "red",
        autoClose: 3000,
      });
    }
  };
  console.log(errors);
  return (
    <div className="px-4 py-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          variant="filled"
          label="Name"
          required
          {...register("name")}
          error={errors.name?.message}
        />

        <Textarea
          variant="filled"
          label="Description"
          autosize
          minRows={3}
          {...register("descriptions")}
          error={errors.descriptions?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="price"
            control={control}
            render={({ field }) => (
              <NumberInput
                variant="filled"
                label="Price ($)"
                required
                min={0}
                value={field.value || 0}
                onChange={(value) => field.onChange(value || 0)}
                error={errors.price?.message}
              />
            )}
          />

          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <NumberInput
                variant="filled"
                label="Quantity"
                required
                min={0}
                value={field.value || 0}
                onChange={(value) => field.onChange(value || 0)}
                error={errors.quantity?.message}
              />
            )}
          />
        </div>

        <TextInput
          variant="filled"
          label="Buyer ID"
          {...register("buyer_id")}
          error={errors.buyer_id?.message}
        />

        <Controller
          name="buyer_at"
          control={control}
          render={({ field }) => (
            <TextInput
              variant="filled"
              label="Purchased At"
              type="datetime-local"
              value={
                field.value
                  ? new Date(field.value).toISOString().slice(0, -1)
                  : ""
              }
              onChange={(e) => {
                const dateValue = e.target.value
                  ? new Date(e.target.value).toISOString()
                  : null;
                field.onChange(dateValue);
              }}
              error={errors.buyer_at?.message}
            />
          )}
        />

        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={closeEdit}
            disabled={updateLoading}
            loading={updateLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={updateLoading}
            loading={updateLoading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ConsumableUpdate;
