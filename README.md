# Github users search


## Project description

Create an input text in which as the user types in, launch a search against Github users and return a result list.


## Specs 

- Query against Github Api: GET https://api.github.com/search/users?q={USER}.
- Try to not add any dependency library on a freshly created create react app.
- Don't forget to check against modern ways to make HTTP requests on frontend side.
- Bonus: manage edge cases (no results, github api rate limit)

## Installation instructions

Versions:
- Node: 14.15.1
- Npm: 6.14.8
- React: 17.0.1

Download code from Github:
```shell
git clone https://github.com/Tybrax/fetch-app.git
```

Navigate to project directory
```shell
cd fetch-app
```

Run the app in development mode. Open http://localhost:3000 to view it in the browser.
```shell
npm start
```

## Project structure
- src
  - App.js
  - components
    - InputForm.js
    - Button.js
    - RenderUsers.js
    - Notification.js
  - utils
    - getUsers.js


## Utilities documentation
The [getUsers](https://github.com/Tybrax/fetch-app/blob/master/src/utils/getUsers.js) function handle different asynchronous operations :
1. declare an API endpoint given a set of attributes such a username (*string*), a page number (*integer*) and a number of results per page (*integer*)

```javascript
const endPoint = `https://api.github.com/search/users?q=${userInput}&page=${pageNumber}&per_page=${resultsPerPage}`;
``` 

2. fetch data from a RESTful API with a GET method

```javascript
const response = await fetch(endPoint, {
  method: 'GET',
  headers: {
    'Content-type': 'application/json',
  },
});
``` 

3. store the remaining calls to API to manage Github API limit rate

```javascript
const APICallsRemaining = response.headers.get('x-ratelimit-remaining');
``` 

4. check for response.status

```javascript
if (response.status === 401) errorJson = await response.status;
if (APICallsRemaining === 0) errorJson = await response.status;
if (APICallsRemaining > 0) responseJson = await response.json();
``` 

5. returns a Promise object

```javascript
return new Promise((resolve, reject) => {
  responseJson ? resolve(responseJson) : reject(errorJson);
});
``` 


## Components documentation

### [App.js](https://github.com/Tybrax/fetch-app/blob/master/src/App.js)

#### function
App.js contains the logic for fetching users data from an external API.

#### import statements
Import of React and built-in hooks, as well as children components and a function designed to handling API calls.

```javascript
import React, { useState, useRef, useEffect, useCallback } from 'react';
import InputForm from './components/InputForm';
import RenderUsers from './components/RenderUsers';
import Notification from './components/Notification';
import { getUsers } from './utils/getUsers';
``` 

#### States
States are handled with the useState built-in hooks. We initialize our states at the top of the component.
- isLoading (*boolean*): allow us to display a loading message when HTTP request status is pending
- userInput (*string*): is used to store the string prompted by the user in the input field
- users (*array*): stores an array of object containing the users information from the API
- hasError (*boolean*): allow serrors handling in .catch statements
- errorType  (*ineteger*): gives more information on errors for accurately display a message to users
- isSubmitted (*boolean*): is triggered when user submits his input
- pageNumber (*integer*): is incremented by one whenever user reaches the last element of the page. Used for implementing infinite scrolling.

```javascript
const [isLoading, setIsLoading] = useState(false);
const [userInput, setUserInput] = useState('');
const [users, setUsers] = useState([]);
const [hasError, setHasError] = useState(false);
const [errorType, setErrorType] = useState({});
const [isSubmitted, setIsSubmitted] = useState(false);
const [pageNumber, setPageNumber] = useState(1);
``` 

#### Reference
A ref is needed for using the [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) for implementing infinite scrolling so that our user does not have to flip through pages when array of result contains thousands of entries.

```javascript
const observer = useRef();
``` 

#### Function scope variable
Given the API endpoint (https://api.github.com/search/users?q={user}&page={pageNumber}&per_page={resultsPerPage}), being able to easily edit the number of entries of users per request increases the app scability. 

```javascript
const resultsPerPage = 10;
```

#### Callback function
The useCallback hook is required to pass a callback to our Ref element and update the state of pageNumber when a target element intersects the device viewport.

```javascript
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
```

#### State lifecycle
The useEffect hook is triggered when the page number state is incremented to call the next page of users when the ref intersects with the device viewport.

The user input cannot be null otherwise the API will send an error. Moreover, the HTTP request is not send if the github API limit rate is reached.

If the request returns a 204, the state is updated with an array of objects. 
A set is created to keep unique entries. 
The spread operator is used to keep entries from the previous API answer.

```javascript
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
```

#### Input changes in form
The handleChange function simply updates the user input state when a change occurs within the input field.

```javascript
const handleChange = (event) => {
  setUserInput(event.target.value);
};
```

#### Input changes in form
The handleSubmit takes an input as parameter and launchs a GET request to the github API given a username, a page number and a number of results per page.
It also prevents the page to refresh when the form is submitted.

```javascript
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
```

#### Rendering
App.js conditionnally renders 3 components :
1. InputForm.js (3 props): 
  - handleSubmit (*function*)
  - handleChange (*function*)
  - user input (*string*)
2. RenderUsers.js (4 props):
  - user (*object*, temporary variable from an iteration in the array of users)
  - index (*integer*)
  - reference (*boolean*, to track last element of the array of users)
  - lastUserElement (*function*, callback) to be called on the last array element
 3. Notifications.js (2 props)
  - message (*string*) to inform the user
  - a type (*string*) for UI purposes
