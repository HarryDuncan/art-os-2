import { TextInput as MantineTextInput } from "@mantine/core";
import styled from "styled-components";
import { InputProps } from "./inputs.types"; // Assuming this is your shared type file

interface StyledTextInputProps extends InputProps {
  placeholder?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

// Styled wrapper for TextInput
const StyledTextInput = styled(MantineTextInput)`
  .mantine-TextInput-label {
    font-weight: 600;
    color: #333;
    margin-bottom: 0.5rem;
  }

  .mantine-TextInput-input {
    border: 2px solid #ccc;
    border-radius: 8px;
    padding: 0.5rem;
    transition: border-color 0.2s ease;

    &:focus {
      border-color: #007bff;
    }

    &:disabled {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }
  }

  .mantine-TextInput-error {
    color: #e63946;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
`;

export const TextInput = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  ...rest
}: StyledTextInputProps) => {
  return (
    <StyledTextInput
      label={label}
      placeholder={placeholder ?? "Enter text..."}
      value={value}
      onChange={onChange}
      error={error}
      {...rest}
    />
  );
};
