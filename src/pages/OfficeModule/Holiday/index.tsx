import { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import momentPlugin from "@fullcalendar/moment";
import { Box, useMantineTheme, rem, Tabs } from "@mantine/core";
import { IconCalendarEvent } from "@tabler/icons-react";
import { EventClickArg, EventInput, DateSelectArg } from "@fullcalendar/core";
import {
  useCreateHolidayMutation,
  useDeleteHolidayMutation,
  useEditHolidayMutation,
  useGetHolidaysQuery,
} from "../../../features/api/holidaySlice";
import { Holiday } from "../../../features/types/holiday";
import AppLoader from "../../../components/ui/AppLoader";
import HolidayModal from "./HolidayModal";
import HolidayApproval from "./HolidayApproval";

interface CalendarEvent extends EventInput {
  id: string;
  description?: string;
}

const HolidayCalendar = () => {
  const theme = useMantineTheme();
  const calendarRef = useRef<FullCalendar>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedHoliday, setSelectedHoliday] =
    useState<Partial<Holiday> | null>(null);

  // API Hooks
  const {
    data: holidaysResponse,
    isLoading,
    isError,
  } = useGetHolidaysQuery({ page: 1, limit: 100 });
  const [createHoliday] = useCreateHolidayMutation();
  const [editHoliday] = useEditHolidayMutation();
  const [deleteHoliday] = useDeleteHolidayMutation();

  const pendingHolidays = Array.isArray(holidaysResponse?.data)
    ? holidaysResponse.data.filter((h) => h.is_approved === "pending")
    : [];

  // Transform API data to calendar events
  const calendarEvents: CalendarEvent[] =
    holidaysResponse?.data && Array.isArray(holidaysResponse.data)
      ? holidaysResponse.data
          .filter((holiday) => holiday.is_approved === "approved") // Filter approved holidays
          .map((holiday: Holiday) => ({
            id: holiday.uid,
            title: holiday.name,
            start: holiday.holiday_start_at, // ✅ Correct start field
            end: holiday.holiday_end_at, // ✅ Add end field
            description: holiday.descriptions,
            allDay: true,
            backgroundColor:
              holiday.is_approved === "approved"
                ? theme.colors.green[6]
                : holiday.is_approved === "pending"
                ? theme.colors.orange[6]
                : theme.colors.red[6],
          }))
      : [];

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    setSelectedHoliday({
      name: "",
      holiday_start_at: selectInfo.startStr,
      descriptions: "",
      active: true,
      is_approved: "false",
    });
    setModalOpen(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const eventId = clickInfo.event.id;
    const holiday = Array.isArray(holidaysResponse?.data)
      ? holidaysResponse.data.find((h) => h.uid === eventId)
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
        name: holidayData.name || "",
        descriptions: holidayData.descriptions || "",
        active: holidayData.active || true,
        holiday_start_at: holidayData.holiday_start_at || "",
        holiday_end_at: holidayData.holiday_end_at || "",
      };

      if (holidayData.uid) {
        const editPayload = {
          uid: holidayData.uid,
          name: holidayData.name || "",
          descriptions: holidayData.descriptions || "",
          active: holidayData.active || true,
          holiday_start_at: holidayData.holiday_start_at || "",
          holiday_end_at: holidayData.holiday_end_at || "",
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

  const handleDelete = async () => {
    if (selectedHoliday?.uid) {
      await deleteHoliday({ id: selectedHoliday.uid }).unwrap();
      setModalOpen(false);
    }
  };

  if (isLoading) return <AppLoader />;
  if (isError) return <div>Error loading holidays</div>;

  return (
    <Box p="md">
      <Tabs
        defaultValue="calendar"
        variant="default"
        className="mx-10"
        color="blue"
      >
        <Tabs.List mb="md">
          <Tabs.Tab value="calendar">Calendar</Tabs.Tab>
          <Tabs.Tab value="approvals">Pending Approvals</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="calendar" pt="md" mb={20}>
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
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: rem(4),
                }}
              >
                <IconCalendarEvent size={14} style={{ marginRight: rem(5) }} />
                <span>{eventInfo.event.title}</span>
              </div>
            )}
          />
        </Tabs.Panel>

        <Tabs.Panel value="approvals" pt="md">
          <HolidayApproval
            holidays={pendingHolidays || []}
            // onApprove={handleApprove}
            // onReject={handleReject}
          />
        </Tabs.Panel>
      </Tabs>

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

export default HolidayCalendar;
