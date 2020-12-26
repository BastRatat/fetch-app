import React from 'react';

const RenderUsers = ({ index, reference, lastUserElement, user }) => {
  if (reference) {
    return (
      <div key={index} ref={lastUserElement}>
        <a href={user.html_url}>
          <p>{user.login}</p>
          <img src={user.avatar_url} alt="avatar" width="150" />
        </a>
        <a href={user.repos_url}>
          <button>Repos</button>
        </a>
      </div>
    );
  } else {
    return (
      <div key={index}>
        <a href={user.html_url}>
          <p>{user.login}</p>
          <img src={user.avatar_url} alt="avatar" width="150" />
        </a>
        <a href={user.repos_url}>
          <button>Repos</button>
        </a>
      </div>
    );
  }
};

export default RenderUsers;
