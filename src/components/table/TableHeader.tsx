import { Table } from "@mantine/core";
import { TableColumnItem } from "./table.types";

interface TableHeaderProps {
  tableColumns: TableColumnItem[];
}
export const TableHeader = ({ tableColumns }: TableHeaderProps) => {
  return (
    <Table.Thead>
      <Table.Tr>
        {tableColumns.map(({ title }) => (
          <Table.Th>{title}</Table.Th>
        ))}
      </Table.Tr>
    </Table.Thead>
  );
};
