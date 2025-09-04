import { notifications } from "@mantine/notifications";
import axios from "axios";
import { useEffect, useRef } from "react";
import { IconX } from "@tabler/icons-react";

export const useAttendancePolling = () => {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        await axios.get(`${import.meta.env.VITE_APP_BASE_URL}attendance`);
        console.log("Attendance updated");
      } catch (error) {
        console.error("Failed to fetch attendance", error);
        notifications.show({
          title: "Sync Failed",
          message: "Unable to update attendance. Please check your connection.",
          color: "red",
          icon: <IconX />,
          autoClose: 4000,
        });
      }
    };

    fetchAttendance();
    intervalRef.current = window.setInterval(fetchAttendance, 60 * 60 * 1000);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);
};
