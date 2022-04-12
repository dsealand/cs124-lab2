import React from 'react';

function Modal({cancelText, onCancel, confirmText, onConfirm, onClose, children}) {
  return (
    <div className={"backdrop"} onClick={onClose}>
      <div className="modal">
        {children}
        <div className="alert-buttons">
          <button className={"alert-button alert-cancel"} type={"button"}
            onClick={() => {
              onCancel();
              onClose();
            }}>
            {cancelText}
          </button>
          <button className={"alert-button alert-ok"} type={"button"}
            onClick={() => {
              onConfirm();
              onClose();
            }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal;