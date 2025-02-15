import styled from "styled-components";
import { ComboboxData, ComboboxItem, Select } from "@mantine/core";
import { InputProps } from "./inputs.types";

interface DropdownProps extends InputProps {
  data: ComboboxData;
  onChange: (value: string | null, option: ComboboxItem) => void;
  placeholder?: string;
  classNames?: string;
}

// Styled wrapper for the Dropdown
const StyledSelect = styled(Select)`
  display: flex;
  flex-direction: column;

  .mantine-Select-input {
    position: relative;
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 0.5rem;
  }

  .mantine-Select-dropdown {
    background-color: #f9f9f9;
  }

  .mantine-Select-label {
    font-weight: bold;
    font-size: 1rem;
    color: #333;
  }
`;

export const Dropdown = ({
  label,
  data,
  onChange,
  placeholder,
  classNames,
}: DropdownProps) => {
  return (
    <StyledSelect
      comboboxProps={{ withinPortal: true }}
      data={data}
      onChange={onChange}
      placeholder={placeholder ?? "Pick one"}
      label={label}
      className={`dropdown ${classNames}`}
    />
  );
};
