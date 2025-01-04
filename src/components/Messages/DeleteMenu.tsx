import React from "react";

interface DeleteMenuProps {
  onDelete: () => void;
  onClose: () => void;
}

const DeleteMenu: React.FC<DeleteMenuProps> = ({ onDelete, onClose }) => {
  return (
    <div className="absolute bottom-0 right-0 mt-1 bg-ash-500 bg-opacity-80 backdrop-blur-sm text-white p-2 rounded-md shadow-lg">
      <button
        onClick={() => {
          onDelete();
          onClose();
        }}
        className="bg-ash-500 text-white px-3 py-1 rounded-md hover:bg-ash-600 transition duration-200"
      >
        Delete
      </button>
    </div>
  );
};


export default DeleteMenu;
