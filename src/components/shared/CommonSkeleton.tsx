import { Skeleton, Table } from "@mantine/core";

interface CommonSkeletonProps {
  cols: number;
  rows?: number;
}

const CommonSkeleton: React.FC<CommonSkeletonProps> = ({ cols, rows = 5 }) => {
  return (
    <Table.Tbody>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <Table.Tr key={rowIndex}>
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Table.Td key={colIndex}>
              <Skeleton height={20} width="100%" />
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </Table.Tbody>
  );
};

export default CommonSkeleton;
