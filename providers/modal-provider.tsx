"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";

interface ModalContextType {
  showModal: (config: {
    title: ReactNode;
    body: ReactNode;
    footer?: ReactNode;
    modalClassName?: string;
    getter?: () => Promise<any>;
  }) => void;
  onClose: () => void;
  data: any | null;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [modalContent, setModalContent] = useState<{
    title?: ReactNode;
    body?: ReactNode;
    modalClassName?: string;
    footer?: ReactNode;
  } | null>(null);

  const [data, setData] = useState<any | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const showModal = async ({
    title,
    body,
    footer,
    modalClassName,
    getter,
  }: {
    title: ReactNode;
    body: ReactNode;
    footer?: ReactNode;
    modalClassName?: string;
    getter?: () => Promise<any>;
  }) => {
    setModalContent({ title, body, footer, modalClassName });

    if (getter) {
      try {
        const result = await getter();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData(null);
      }
    } else {
      setData(null);
    }

    onOpen();
  };

  return (
    <ModalContext.Provider value={{ showModal, onClose, data }}>
      {children}
      <Modal
        isOpen={isOpen}
        onOpenChange={onClose}
        className={modalContent?.modalClassName}
        classNames={{
          base: "dark:bg-black",
          body: "dark:bg-black",
          header: "dark:bg-black",
          footer: "dark:bg-black",
          backdrop: "bg-black/50 dark:bg-black/70"
        }}
      >
        <ModalContent className={`dark:bg-black ${modalContent?.modalClassName || ""}`}>
          {modalContent && (
            <>
              {modalContent.title && (
                <ModalHeader>{modalContent.title}</ModalHeader>
              )}
              {modalContent.body && <ModalBody>{modalContent.body}</ModalBody>}
              {modalContent.footer && (
                <ModalFooter>{modalContent.footer}</ModalFooter>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
    </ModalContext.Provider>
  );
};

// Hook to use modal context
export const useModalContext = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModalContext must be used within a ModalProvider");
  }
  return context;
};
