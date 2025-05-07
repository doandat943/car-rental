"use client";

interface DeleteCarModalProps {
  carName: string;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteCarModal = ({
  carName,
  onClose,
  onConfirm,
}: DeleteCarModalProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg rounded-sm border border-stroke bg-white p-6 shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke pb-4 dark:border-strokedark">
          <h3 className="font-semibold text-black dark:text-white">
            Confirm Delete
          </h3>
        </div>

        <div className="py-6">
          <p className="text-black dark:text-white">
            Are you sure you want to delete car <span className="font-medium">{carName}</span>?
            This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex justify-center rounded border border-stroke py-2 px-6 font-medium text-black hover:shadow-1 dark:border-strokedark dark:text-white"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex justify-center rounded bg-danger py-2 px-6 font-medium text-white hover:bg-opacity-90"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteCarModal; 