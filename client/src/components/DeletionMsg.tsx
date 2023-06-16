import './DeletionMsg.scss';
import React from 'react';

interface Props {
  invoiceID: string;
  deleteFunc: () => void;
  cancelFunc: () => void;
}

const DeletionMsg: React.FC<Props> = ({ invoiceID, deleteFunc, cancelFunc }) => {
  return (
    <div className="deletion-msg">
      <div className="overlay" onClick={cancelFunc}></div>
      <div className="msg-box el">
        <h1>Confirm Deletion</h1>
        <p>
          Are you sure you want to delete invoice <strong>{invoiceID}</strong> This action cannot be
          undone.
        </p>
        <div className="btn-wrapper">
          <button className="cancel-btn" onClick={cancelFunc}>
            Cancel
          </button>
          <button className="delete-btn" onClick={deleteFunc}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletionMsg;
