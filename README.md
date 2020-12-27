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
