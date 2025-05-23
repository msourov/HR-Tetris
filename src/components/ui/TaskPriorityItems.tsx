import { Box, SelectProps, Text } from "@mantine/core";

interface ItemProps extends React.ComponentPropsWithoutRef<"div"> {
  value: string;
  label: string;
}

const colorMap = {
  high: {label: "High", color: "red"},
  medium: {label: "Medium", color: "orange"},
  low: {label: "Low", color: "green"},
};

const PriorityItem : SelectProps['renderOption']  = (
  ({ option, checked }) => {
    return (
      <div>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor:
                (option.value in colorMap
                  ? colorMap[option.value as keyof typeof colorMap].color
                  : "gray"),
            }}
          />
          <Text>{option.label}</Text>
        </Box>
      </div>
    );
  }
);

export default PriorityItem;
