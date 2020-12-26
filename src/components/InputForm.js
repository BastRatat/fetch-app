import React from 'react';
import Button from './Button';

const InputForm = ({ handleSubmit, handleChange, userInput }) => {
  return (
    <form onSubmit={(event) => handleSubmit(event, userInput)}>
      <input
        type="text"
        value={userInput}
        onChange={handleChange}
        placeholder="username"
      />
      <Button userInput={userInput} />
    </form>
  );
};

export default InputForm;
