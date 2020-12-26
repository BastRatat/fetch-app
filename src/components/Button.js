import React from 'react';

const Button = ({ userInput }) => {
  return (
    <button type="submit" disabled={userInput === '' ? true : false}>
      Search
    </button>
  );
};

export default Button;
