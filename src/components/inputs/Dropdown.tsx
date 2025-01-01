import { ComboboxItem, Select, TextInput } from "@mantine/core";
import { InputProps } from "./inputs.types";

interface DropdownProps extends InputProps {
  data: string[];
  onChange: (value: string | null, option: ComboboxItem) => void;
  placeholder?: string;
  classNames?: string;
}
export const Dropdown = ({
  label,
  data,
  onChange,
  placeholder,
  classNames,
}: DropdownProps) => {
  return (
    <Select
      mt="md"
      comboboxProps={{ withinPortal: true }}
      data={data}
      onChange={onChange}
      placeholder={placeholder ?? "Pick one"}
      label={label}
      className={`dropdown ${classNames}`}
    />
  );
};
