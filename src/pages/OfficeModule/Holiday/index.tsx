import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import momentPlugin from "@fullcalendar/moment";
import {
  Box,
  Modal,
  TextInput,
  Button,
  useMantineTheme,
  rem,
  Textarea,
  LoadingOverlay,
  Group,
} from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import { EventClickArg, EventInput, DateSelectArg } from "@fullcalendar/core";
import {
  useCreateHolidayMutation,
  useDeleteHolidayMutation,
  useEditHolidayMutation,
  useGetHolidaysQuery,
} from "../../../features/api/holidaySlice";
import { Holiday } from "../../../features/types/holiday";

interface CalendarEvent extends EventInput {
  id: string;
  description?: string;
}

const HolidayCalendar = () => {
  const theme = useMantineTheme();
  const calendarRef = useRef<FullCalendar>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] = useState<Partial<Holiday> | null>(null);

  // API Hooks
  const { data: holidaysResponse, isLoading, isError } = useGetHolidaysQuery({ page: 1, limit: 100 });
  const [createHoliday] = useCreateHolidayMutation();
  const [editHoliday] = useEditHolidayMutation();
  const [deleteHoliday] = useDeleteHolidayMutation();

  // Transform API data to calendar events
  const calendarEvents: CalendarEvent[] = holidaysResponse?.data && Array.isArray(holidaysResponse.data)
    ? holidaysResponse.data
      .filter(holiday => holiday.is_approve === "approved") // Filter approved holidays
      .map((holiday: Holiday) => ({
        id: holiday.uid,
        title: holiday.name,
        start: holiday.holiday_start_at, // ✅ Correct start field
        end: holiday.holiday_end_at,     // ✅ Add end field
        description: holiday.descriptions,
        allDay: true,
        backgroundColor: theme.colors.blue[6],
      }))
    : [];

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedHoliday({
      name: '',
      holiday_start_at: selectInfo.startStr,
      descriptions: '',
      active: true,
      is_approve: "false",
    });
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventId = clickInfo.event.id;
    const holiday = Array.isArray(holidaysResponse?.data)
      ? holidaysResponse.data.find(h => h.uid === eventId)
      : undefined;
    if (holiday) {
      setSelectedHoliday(holiday);
      setModalOpen(true);
    }
  };

  const handleSubmit = async (holidayData: Partial<Holiday>) => {
    try {
      const createPayload = {
        // ...(holidayData.uid && { uid: holidayData.uid }),
        name: holidayData.name || '',
        descriptions: holidayData.descriptions || '',
        active: holidayData.active || true,
        holiday_start_at: holidayData.holiday_start_at || '',
        holiday_end_at: holidayData.holiday_end_at || ''
      };

      if (holidayData.uid) {
        const editPayload = {
          uid: holidayData.uid,
          name: holidayData.name || '',
          descriptions: holidayData.descriptions || '',
          active: holidayData.active || true,
          holiday_start_at: holidayData.holiday_start_at || '',
          holiday_end_at: holidayData.holiday_end_at || ''
        };
        await editHoliday(editPayload).unwrap();
      } else {
        await createHoliday(createPayload).unwrap();
      }
      setModalOpen(false);
    } catch (error) {
      console.error("Failed to save holiday:", error);
    }
  };

  console.log('holidaysResponse', JSON.stringify(holidaysResponse, undefined, 2));


  const handleDelete = async () => {
    if (selectedHoliday?.uid) {
      await deleteHoliday({ id: selectedHoliday.uid }).unwrap();
      setModalOpen(false);
    }
  };

  if (isLoading) return <LoadingOverlay visible={true} />;
  if (isError) return <div>Error loading holidays</div>;

  return (
    <Box p="md">
      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          listPlugin,
          momentPlugin,
        ]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
        }}
        events={calendarEvents}
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={true}
        nowIndicator={true}
        eventDisplay="block"
        eventTimeFormat={{
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        }}
        height="80vh"
        select={handleDateSelect}
        eventClick={handleEventClick}
        eventContent={(eventInfo) => (
          <div style={{ display: "flex", alignItems: "center", padding: rem(4) }}>
            <IconCalendarEvent size={14} style={{ marginRight: rem(5) }} />
            <span>{eventInfo.event.title}</span>
          </div>
        )}
      />

      <HolidayModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        holiday={selectedHoliday}
        onSubmit={handleSubmit}
        onDelete={selectedHoliday?.uid ? handleDelete : undefined}
      />
    </Box>
  );
};

interface HolidayModalProps {
  opened: boolean;
  onClose: () => void;
  holiday: Partial<Holiday> | null;
  onSubmit: (holiday: Partial<Holiday>) => void;
  onDelete?: () => void;
}

const HolidayModal = ({ opened, onClose, holiday, onSubmit, onDelete }: HolidayModalProps) => {
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

  const [name, setName] = useState(holiday?.name || '');
  const [startDate, setStartDate] = useState(
    holiday?.holiday_start_at ? new Date(holiday.holiday_start_at).toISOString().split('T')[0] : ''
  );
  const [endDate, setEndDate] = useState(
    holiday?.holiday_end_at ? new Date(holiday.holiday_end_at).toISOString().split('T')[0] : ''
  );
  const [description, setDescription] = useState(holiday?.descriptions || '');
  const [isActive, setIsActive] = useState(holiday?.active ?? true);

  useEffect(() => {
    if (holiday) {
      setName(holiday.name || '');
      setDescription(holiday.descriptions || '');
      setIsActive(holiday.active ?? true);
      setStartDate(
        holiday.holiday_start_at ? new Date(holiday.holiday_start_at).toISOString().split('T')[0] : ''
      );
      setEndDate(
        holiday.holiday_end_at ? new Date(holiday.holiday_end_at).toISOString().split('T')[0] : ''
      );
    }
  }, [holiday]);



  const handleSubmit = () => {
    onSubmit({
      ...holiday,
      name,
      descriptions: description,
      active: isActive,
      holiday_start_at: new Date(startDate).toISOString(),
      holiday_end_at: new Date(endDate).toISOString()
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

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {onDelete && (
          <Button color="red" onClick={onDelete}>
            Delete
          </Button>
        )}
        <div style={{ display: 'flex', gap: rem(8) }}>
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

export default HolidayCalendar;