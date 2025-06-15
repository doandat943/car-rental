'use client';

import { createContext, useContext, useState } from 'react';

const CalendarModalContext = createContext();

export const useCalendarModal = () => {
  const context = useContext(CalendarModalContext);
  if (!context) {
    throw new Error('useCalendarModal must be used within a CalendarModalProvider');
  }
  return context;
};

export const CalendarModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  const openModal = (car) => {
    setSelectedCar(car);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedCar(null);
  };

  return (
    <CalendarModalContext.Provider value={{
      isOpen,
      selectedCar,
      openModal,
      closeModal
    }}>
      {children}
    </CalendarModalContext.Provider>
  );
}; 