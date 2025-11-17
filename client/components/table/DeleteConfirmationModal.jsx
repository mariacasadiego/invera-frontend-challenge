'use client';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal-backdrop fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-title"
    >
      <div
        className="card p-4 sm:p-5 md:p-6 rounded-md w-full max-w-sm sm:max-w-md border text-primary"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="delete-title" className="text-base sm:text-lg font-bold mb-3 sm:mb-4">Confirmar eliminación</h3>
        <p className="text-sm sm:text-base text-secondary mb-4 sm:mb-6">¿Estás seguro de que quieres eliminar este usuario?</p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end">
          <button
            onClick={onClose}
            className="button-secondary flex items-center justify-center px-4 py-2 text-sm sm:text-base order-2 sm:order-1"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="button-primary bg-red-500 hover:bg-red-600 flex items-center justify-center px-4 py-2 text-sm sm:text-base order-1 sm:order-2"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;