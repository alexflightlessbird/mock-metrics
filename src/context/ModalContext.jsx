import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [modals, setModals] = useState({});

  const openModal = (modalId) => {
    setModals((prev) => ({ ...prev, [modalId]: true }));
  };

  const closeModal = (modalId) => {
    setModals((prev) => ({ ...prev, [modalId]: false }));
  };

  const closeAllModals = () => {
    setModals({});
  };

  const isOpen = (modalId) => {
    return !!modals[modalId];
  };

  return (
    <ModalContext.Provider
      value={{ openModal, closeModal, closeAllModals, isOpen }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  return useContext(ModalContext);
}
