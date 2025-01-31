import { Table } from "@mantine/core";
import { TableHeader } from "./TableHeader";
import { TableColumnItem } from "./table.types";
import { TableRows } from "./TableRows";

interface TableComponentProps {
  tableColumns: TableColumnItem[];
  rowItems: Record<string, unknown>[];
}
export const TableComponent = ({
  tableColumns,
  rowItems,
}: TableComponentProps) => {
  return (
    <Table>
      <TableHeader tableColumns={tableColumns} />
      <Table.Tbody>
        <TableRows tableColumns={tableColumns} rowItems={rowItems} />
      </Table.Tbody>
    </Table>
  );
};
