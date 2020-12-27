import React from 'react';
import Button from '../Button/Button';
import './InputForm.css';
import gitHubLogo from '../../images/github.png';

const InputForm = ({ handleSubmit, handleChange, userInput }) => {
  return (
    <div className="form--container">
      <div className="form--header">
        <img src={gitHubLogo} alt="github logo" className="logo" />
        <h2 className="form--title">Find Github users</h2>
      </div>
      <form onSubmit={(event) => handleSubmit(event, userInput)}>
        <input
          type="text"
          value={userInput}
          onChange={handleChange}
          placeholder="username"
          className="input--field"
        />
        <Button userInput={userInput} />
      </form>
    </div>
  );
};

export default InputForm;
