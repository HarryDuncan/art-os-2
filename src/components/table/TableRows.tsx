import { Table } from "@mantine/core";
import { TableColumnItem } from "./table.types";

interface TableRowProps {
  tableColumns: TableColumnItem[];
  rowItems: Record<string, unknown>[];
}
export const TableRows = ({ tableColumns, rowItems }: TableRowProps) => {
  return (
    <>
      {rowItems.map((rowItem, index) => (
        <Table.Tr key={index}>
          {tableColumns.map(({ key }, tdIndex) => (
            <Table.Td key={`${String(rowItem[key])}-${tdIndex}`}>
              {rowItem[key] ? String(rowItem[key]) : "-"}
            </Table.Td>
          ))}
        </Table.Tr>
      ))}
    </>
  );
};
