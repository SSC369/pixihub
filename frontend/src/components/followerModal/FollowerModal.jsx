import React, { useState } from "react";
import "./style.scss";

const FollowerModal = ({ show, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h4 className="modal-title">Followers</h4>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">Body</div>
        <div className="modal-footer">
          <button className="modal-button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Example usage
const App = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <button onClick={() => setIsModalOpen(true)}>Open Modal</button>
      <Modal
        show={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Modal Title"
      >
        <p>This is the modal content.</p>
      </Modal>
    </div>
  );
};

export default FollowerModal;
