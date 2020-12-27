import React from 'react';
import './Button.css';

const Button = ({ userInput }) => {
  return (
    <button
      className="search--button"
      type="submit"
      disabled={userInput === '' ? true : false}
    >
      Find
    </button>
  );
};

export default Button;
