'use client';

import { useCalendarModal } from '@/contexts/CalendarModalContext';
import CalendarModal from './CalendarModal';

export default function GlobalCalendarModal() {
  const { isOpen, selectedCar, closeModal } = useCalendarModal();

  return (
    <CalendarModal
      isOpen={isOpen}
      onClose={closeModal}
      car={selectedCar}
    />
  );
} 