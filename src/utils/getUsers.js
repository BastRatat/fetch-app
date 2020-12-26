export const getUsers = async (userInput, pageNumber, resultsPerPage) => {
  const endPoint = `https://api.github.com/search/users?q=${userInput}&page=${pageNumber}&per_page=${resultsPerPage}`;
  let errorJson = undefined;
  let responseJson = undefined;
  const response = await fetch(endPoint, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
    },
  });

  const APICallsRemaining = response.headers.get('x-ratelimit-remaining');
  console.log(APICallsRemaining);

  if (response.status === 401) errorJson = await response.status;
  if (APICallsRemaining === 0) errorJson = await response.status;
  if (APICallsRemaining > 0) responseJson = await response.json();

  return new Promise((resolve, reject) => {
    responseJson ? resolve(responseJson) : reject(errorJson);
  });
};
