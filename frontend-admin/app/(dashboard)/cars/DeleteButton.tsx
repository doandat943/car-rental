"use client";

import { useState } from "react";
import { FaTrash } from "react-icons/fa";

interface DeleteButtonProps {
  id: number;
  onDelete: (id: number) => void;
}

const DeleteButton = ({ id, onDelete }: DeleteButtonProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDelete = () => {
    onDelete(id);
    setIsConfirmOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsConfirmOpen(true)}
        className="hover:text-danger"
      >
        <FaTrash />
      </button>

      {/* Confirm Dialog */}
      {isConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:w-[24rem]">
            <div className="flex items-center justify-between border-b border-stroke pb-4 dark:border-strokedark">
              <h3 className="font-semibold text-black dark:text-white">
                Confirm Deletion
              </h3>
              <button
                onClick={() => setIsConfirmOpen(false)}
                className="text-xl"
              >
                ✕
              </button>
            </div>

            <div className="mt-4">
              <p className="text-black dark:text-white">
                Are you sure you want to delete this car? This action cannot be undone.
              </p>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsConfirmOpen(false)}
                  className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="flex justify-center rounded bg-danger py-2 px-6 font-medium text-white hover:bg-opacity-90"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DeleteButton; 