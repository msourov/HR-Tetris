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
  ColorPicker,
  useMantineTheme,
  Select,
  rem,
  Textarea,
} from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import { EventClickArg, EventInput, DateSelectArg } from "@fullcalendar/core";

interface EventData {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  description: string;
  allDay: boolean;
}

interface EventModalProps {
  opened: boolean;
  onClose: () => void;
  eventData: Partial<EventData> | null;
  onSubmit: (event: Omit<EventData, "id">) => void;
}

const Holiday = () => {
  const theme = useMantineTheme();
  const calendarRef = useRef<FullCalendar>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Partial<EventData> | null>(
    null
  );
  const [events, setEvents] = useState<EventData[]>([
    {
      id: "1",
      title: "Team Meeting",
      start: new Date().toISOString(),
      end: new Date(Date.now() + 3600000).toISOString(),
      color: theme.colors.blue[6],
      description: "Quarterly planning session",
      allDay: false,
    },
  ]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedEvent({
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      allDay: selectInfo.allDay,
    });
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent({
      id: event.id,
      title: event.title,
      start: event.startStr,
      end: event.endStr,
      color: event.backgroundColor,
      description: event.extendedProps.description,
      allDay: event.allDay,
    });
    setModalOpen(true);
  };

  const handleEventSubmit = (eventData: Omit<EventData, "id">) => {
    const newEvent: EventData = {
      ...eventData,
      id: selectedEvent?.id || Date.now().toString(),
    };

    setEvents((prev) =>
      prev.filter((e) => e.id !== newEvent.id).concat(newEvent)
    );
    setModalOpen(false);
  };

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
        events={events as EventInput[]}
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
          <div
            style={{ display: "flex", alignItems: "center", padding: rem(4) }}
          >
            <IconCalendarEvent size={14} style={{ marginRight: rem(5) }} />
            <span>{eventInfo.event.title}</span>
          </div>
        )}
      />

      <EventModal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        eventData={selectedEvent}
        onSubmit={handleEventSubmit}
      />
    </Box>
  );
};

const EventModal = ({
  opened,
  onClose,
  eventData,
  onSubmit,
}: EventModalProps) => {
  const [title, setTitle] = useState(eventData?.title || "");
  const [start, setStart] = useState(eventData?.start || "");
  const [end, setEnd] = useState(eventData?.end || "");
  const [color, setColor] = useState(eventData?.color || "");
  const [description, setDescription] = useState(eventData?.description || "");
  const [allDay, setAllDay] = useState(eventData?.allDay || false);

  useEffect(() => {
    if (eventData) {
      setTitle(eventData.title || "");
      setStart(eventData.start || "");
      setEnd(eventData.end || "");
      setColor(eventData.color || "");
      setDescription(eventData.description || "");
      setAllDay(eventData.allDay || false);
    }
  }, [eventData]);

  const handleSubmit = () => {
    onSubmit({
      title,
      start,
      end,
      color,
      description,
      allDay,
    });
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={eventData?.id ? "Edit Event" : "New Event"}
      size="lg"
      centered
    >
      <TextInput
        label="Event Title"
        value={title}
        onChange={(e) => setTitle(e.currentTarget.value)}
        required
        mb="sm"
      />

      <Select
        label="All Day Event"
        value={allDay.toString()}
        onChange={(value) => setAllDay(value === "true")}
        data={[
          { value: "true", label: "Yes" },
          { value: "false", label: "No" },
        ]}
        mb="sm"
      />

      <TextInput
        label="Start Date/Time"
        type="datetime-local"
        value={start}
        onChange={(e) => setStart(e.currentTarget.value)}
        required
        mb="sm"
      />

      <TextInput
        label="End Date/Time"
        type="datetime-local"
        value={end}
        onChange={(e) => setEnd(e.currentTarget.value)}
        required
        mb="sm"
      />

      <ColorPicker
        format="hex"
        value={color}
        onChange={setColor}
        swatches={[
          "#25262b",
          "#868e96",
          "#fa5252",
          "#e64980",
          "#be4bdb",
          "#7950f2",
          "#4c6ef5",
          "#228be6",
          "#15aabf",
          "#12b886",
          "#40c057",
          "#82c91e",
          "#fab005",
          "#fd7e14",
        ]}
        mb="sm"
      />

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.currentTarget.value)}
        rows={4}
        mb="md"
      />

      <Button onClick={handleSubmit} fullWidth>
        {eventData?.id ? "Update Event" : "Create Event"}
      </Button>
    </Modal>
  );
};

export default Holiday;
