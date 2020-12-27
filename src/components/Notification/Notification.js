import React from 'react';
import './Notification.css';

const Notification = ({ message, type }) => {
  return (
    <div className="notification--container">
      <div className={type === 'error' ? 'error' : 'loading'}>
        <h3 className="notification--message">{message}</h3>
      </div>
    </div>
  );
};

export default Notification;
