import { useDisclosure } from "@mantine/hooks";
import { Modal, Button } from "@mantine/core";
import { ReactNode } from "react";

interface ModalProps {
  title: string;
  openModalText: string;
  children: ReactNode;
  isOpen?: boolean;
}
export const ModalComponent = ({
  title,
  openModalText,
  children,
  isOpen = false,
}: ModalProps) => {
  const [opened, { open, close }] = useDisclosure(isOpen);

  return (
    <>
      <Modal opened={opened} onClose={close} title={title} centered>
        {children}
      </Modal>

      <Button variant="default" onClick={open}>
        {openModalText}
      </Button>
    </>
  );
};
