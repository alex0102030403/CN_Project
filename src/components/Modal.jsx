import React from 'react';

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        {children}
        <button onClick={onClose} style={buttonStyle}>
          Close
        </button>
      </div>
    </div>
  );
}

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black overlay
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const modalStyle = {
  backgroundColor: 'rgba(128, 128, 128, 0.9)', // Grey background with some transparency
  color: 'white', // White text
  padding: '20px',
  borderRadius: '8px',
  textAlign: 'center',
};

const buttonStyle = {
  marginTop: '10px',
  padding: '5px 10px',
  border: 'none',
  backgroundColor: 'white',
  color: 'grey',
  cursor: 'pointer',
  borderRadius: '5px',
};

export default Modal;
