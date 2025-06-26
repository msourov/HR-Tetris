import { Anchor, Text } from "@mantine/core";

interface InfoItemProps {
  label: string;
  value?: string;
  link?: string;
  multiline?: boolean;
  highlight?: boolean;
}

const InfoItem = ({
  label,
  value,
  link,
  multiline,
  highlight,
}: InfoItemProps) => (
  <div className="flex flex-col">
    <Text size="sm" c="dimmed" className="mb-1 font-medium">
      {label}
    </Text>
    {link ? (
      <Anchor
        href={link}
        target="_blank"
        className="hover:text-blue-600 transition-colors"
      >
        <Text
          className={`${multiline ? "whitespace-pre-wrap" : ""} ${
            highlight ? "text-sm font-semibold text-gray-900" : "text-gray-700"
          }`}
        >
          {value || "--"}
        </Text>
      </Anchor>
    ) : (
      <Text
        className={`${multiline ? "whitespace-pre-wrap" : ""} ${
          highlight ? "text-sm text-gray-900" : "text-gray-700"
        }`}
      >
        {value || "--"}
      </Text>
    )}
  </div>
);

export default InfoItem;
