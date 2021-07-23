import React from 'react';
import Modal from 'react-modal';

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
    },
};

const rootEl = document.getElementById('root');

// Modal.setAppElement('#root');
Modal.setAppElement(rootEl);

Modal.defaultStyles.overlay.backgroundColor = 'rgba(92, 52, 52, 0.5)';

export const CustomModal = ({
    header,
    text,
    isOpen,
    onConfirm,
    onConfirmText,
    onCancel,
    onCancelText,
}) => {
    return (
        <Modal isOpen={isOpen} style={customStyles}>
            <div className="modal__body">
                <p className="tooltip">{header}</p>
                <p className="tooltip__small">{text}</p>
                {onConfirm && (
                    <button className="modal-button" onClick={onConfirm}>
                        {onConfirmText || 'Ок'}
                    </button>
                )}
                {onCancel && (
                    <button className="modal-button" onClick={onCancel}>
                        {onCancelText || 'Отмена'}
                    </button>
                )}
            </div>
        </Modal>
    );
};
