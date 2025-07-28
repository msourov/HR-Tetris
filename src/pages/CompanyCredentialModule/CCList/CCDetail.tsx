import { Box, Divider, Text } from "@mantine/core";
import { CompanyCredential } from "../../../features/types/companyCredentials";
import useFormatDate from "../../../services/utils/useFormatDate";
import { Logs } from "../../../features/types/shared";
import dayjs from "dayjs";

export function CertificateDetail({ item }: { item: CompanyCredential }) {
  const { formatDate } = useFormatDate();
  return (
    <Box size="lg" className="lg:px-6 lg:py-4 px-2">
      <div className="space-y-3">
        {/* Header */}
        <div>
          <Text fw={600} size="lg" className="text-blue-600">
            {item?.name}
          </Text>
        </div>

        {/* Description */}
        <div>
          <Text size="sm" className="text-gray-700">
            {item?.descriptions}
          </Text>
        </div>

        {/* Validity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Text size="sm" c="dimmed">
              Created
            </Text>
            <Text size="sm" className="text-gray-800">
              {formatDate(item?.creation_date ?? "")}
            </Text>
          </div>
          <div>
            <Text size="sm" c="dimmed">
              Expiry Date
            </Text>
            <Text
              size="sm"
              className={`font-semibold ${
                dayjs(item?.expire_at).isBefore(dayjs())
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            >
              {formatDate(item?.expire_at ?? "")}
            </Text>
          </div>
        </div>

        {/* Notify */}
        <div>
          <div className="text-sm space-y-1">
            <Text c="dimmed">Mobile Numbers:</Text>
            <ul className="list-disc pl-6 text-gray-700 font-semibold">
              {item?.notify_mobile.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
            <Text c="dimmed" mt={6}>
              Reminder before expiry (in days):
            </Text>
            <div className="flex gap-2 mt-1">
              {item?.notify_b_days.map((d, i) => (
                <span
                  key={i}
                  className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                >
                  {d}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Logs */}
        <div>
          <Divider my={8} />
          <Text fw={500} size="sm" className="text-gray-600 mb-2 text-center">
            Logs
          </Text>
          <div className="space-y-2 max-h-[280px] scrollbar-custom overflow-y-auto">
            {Array.isArray(item?.logs) ? (
              item?.logs.map((log, i) => (
                <div
                  key={i}
                  className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3"
                >
                  <Text>{log.message}</Text>
                  <Text size="sm" c="dimmed">
                    {new Date(log.create_at).toLocaleString()} by {log.admin}
                  </Text>
                </div>
              ))
            ) : item?.logs ? (
              <div className="text-sm text-gray-700 border-l-2 border-blue-200 pl-3">
                <Text size="xs" c="dimmed">
                  {typeof item.logs === "object" &&
                  "create_at" in item.logs &&
                  "admin" in item.logs
                    ? `${new Date(
                        (item.logs as Logs).create_at
                      ).toLocaleString()} by ${(item.logs as Logs).admin}`
                    : "No log details available"}
                </Text>
                <Text>
                  {typeof item.logs === "object" && "message" in item.logs
                    ? (item.logs as Logs).message
                    : ""}
                </Text>
              </div>
            ) : (
              <Text size="sm" c="dimmed">
                No logs available
              </Text>
            )}
          </div>
        </div>
      </div>
    </Box>
  );
}
