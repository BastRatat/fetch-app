import React from 'react';
import './RenderUsers.css';

const RenderUsers = ({ index, reference, lastUserElement, user }) => {
  if (reference) {
    return (
      <div key={index} ref={lastUserElement} className="users--container">
        <a href={user.html_url}>
          <h3>{user.login}</h3>
          <div className="image--container">
            <img src={user.avatar_url} alt="avatar" className="avatar" />
          </div>
        </a>
      </div>
    );
  } else {
    return (
      <div key={index} className="users--container">
        <a href={user.html_url}>
          <h3>{user.login}</h3>
          <div className="image--container">
            <img src={user.avatar_url} alt="avatar" className="avatar" />
          </div>
        </a>
      </div>
    );
  }
};

export default RenderUsers;
