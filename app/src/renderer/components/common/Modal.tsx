import React from 'react';

type ModalProps = {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg w-1/3 p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >
            ✖
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}

export default Modal;
