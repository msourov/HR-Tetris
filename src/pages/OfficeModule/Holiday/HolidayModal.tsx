import { useState, useEffect } from "react";
import { Modal, TextInput, Button, rem, Textarea, Group } from "@mantine/core";
import { Holiday } from "../../../features/types/holiday";

interface HolidayModalProps {
  opened: boolean;
  onClose: () => void;
  holiday: Partial<Holiday> | null;
  onSubmit: (holiday: Partial<Holiday>) => void;
  onDelete?: () => void;
}

const HolidayModal = ({
  opened,
  onClose,
  holiday,
  onSubmit,
  onDelete,
}: HolidayModalProps) => {
  // const [name, setName] = useState(holiday?.name || '');
  // const [startDate, setStartDate] = useState(holiday?.holiday_start_at?.split('T')[0] || '');
  // const [endDate, setEndDate] = useState(holiday?.holiday_end_at?.split('T')[0] || '');
  // const [description, setDescription] = useState(holiday?.descriptions || '');

  // useEffect(() => {
  //   if (holiday) {
  //     setName(holiday.name || '');
  //     setDate(holiday.holiday_at?.split('T')[0] || '');
  //     setDescription(holiday.descriptions || '');
  //   }
  // }, [holiday]);

  const [name, setName] = useState(holiday?.name || "");
  const [startDate, setStartDate] = useState(
    holiday?.holiday_start_at
      ? new Date(holiday.holiday_start_at).toISOString().split("T")[0]
      : ""
  );
  const [endDate, setEndDate] = useState(
    holiday?.holiday_end_at
      ? new Date(holiday.holiday_end_at).toISOString().split("T")[0]
      : ""
  );
  const [description, setDescription] = useState(holiday?.descriptions || "");
  const [isActive, setIsActive] = useState(holiday?.active ?? true);

  useEffect(() => {
    if (holiday) {
      setName(holiday.name || "");
      setDescription(holiday.descriptions || "");
      setIsActive(holiday.active ?? true);
      setStartDate(
        holiday.holiday_start_at
          ? new Date(holiday.holiday_start_at).toISOString().split("T")[0]
          : ""
      );
      setEndDate(
        holiday.holiday_end_at
          ? new Date(holiday.holiday_end_at).toISOString().split("T")[0]
          : ""
      );
    }
  }, [opened, holiday?.uid]);

  const handleSubmit = () => {
    onSubmit({
      ...holiday,
      name,
      descriptions: description,
      active: isActive,
      holiday_start_at: new Date(`${startDate}T00:00`).toISOString(),
      holiday_end_at: new Date(`${endDate}T00:00`).toISOString(),
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={holiday?.uid ? "Edit Holiday" : "Create Holiday"}
      size="lg"
      centered
    >
      <TextInput
        label="Holiday Name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        required
        mb="sm"
      />

      <Group grow mb="sm">
        <TextInput
          label="Start Date"
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.currentTarget.value)}
          required
        />
        <TextInput
          label="End Date"
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.currentTarget.value)}
          required
        />
      </Group>

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        rows={4}
        mb="md"
      />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {onDelete && (
          <Button color="red" onClick={onDelete}>
            Delete
          </Button>
        )}
        <div style={{ display: "flex", gap: rem(8) }}>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {holiday?.uid ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default HolidayModal;
