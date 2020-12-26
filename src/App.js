// Imports
import React, { useState, useRef, useEffect, useCallback } from 'react';
import InputForm from './components/InputForm';
import RenderUsers from './components/RenderUsers';
import Notification from './components/Notification';
import { getUsers } from './utils/getUsers';

function App() {
  // States, block variables and refs
  const [isLoading, setIsLoading] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [users, setUsers] = useState([]);
  const [hasError, setHasError] = useState(false);
  const [errorType, setErrorType] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const resultsPerPage = 10;
  const observer = useRef();

  // Callback called on ref to increment page number on scroll
  const lastUserElement = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading]
  );

  // Query against Github API when page number is updated
  useEffect(() => {
    if (userInput !== '' && !hasError) {
      const request = getUsers(userInput, pageNumber, resultsPerPage);
      setIsLoading(true);
      request
        .then((res) => {
          setUsers((previousUsers) => [
            ...new Set([...previousUsers, ...res.items]),
          ]);
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          setHasError(true);
          setErrorType(error);
        });
    }
  }, [pageNumber]);

  // update state to store user input
  const handleChange = (event) => {
    setUserInput(event.target.value);
  };

  // Query against Github API when button is clicked
  const handleSubmit = (event, input) => {
    event.preventDefault();
    setIsLoading(true);
    setIsSubmitted(true);
    const request = getUsers(input, pageNumber, resultsPerPage);
    request
      .then((res) => {
        setUsers(res.items);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        setHasError(true);
        setErrorType(error);
      });
  };

  return (
    <div>
      <InputForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        userInput={userInput}
      />
      <div>
        {users.length > 0 &&
          users.map((user, index) => {
            if (users.length === index + 1) {
              return (
                <RenderUsers
                  user={user}
                  index={index}
                  reference={true}
                  lastUserElement={lastUserElement}
                />
              );
            } else {
              return (
                <RenderUsers
                  user={user}
                  index={index}
                  reference={false}
                  lastUserElement={lastUserElement}
                />
              );
            }
          })}
        {isSubmitted && users.length === 0 && !errorType === 403 && (
          <Notification message="User not found" type="error" />
        )}
      </div>
      {hasError && <Notification message="API rate exceeded" type="error" />}
      {isLoading && <Notification message="Loading..." type="loading" />}
    </div>
  );
}

export default App;
