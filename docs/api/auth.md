― Auth
# Register
Register's a user.
- **Method** : `POST`
- **URL** : `/api/v1/auth/register`
- **Params** : `{ *email, *username, *password }`

## Success response
- **Code**: `201 Created` - Successfully registered.

## Error responses
- **Code** : `400 Bad Request` - If one of the ff: email, username, password are falsy.
- **Code** : `409 Conflict` - If one of the ff: email, username are already taken.

## Returns 
- **Cookie** : `token` - An access token issued to the user.

## Example
```js
/* Axios */
const axios = require('axios'); // https://www.npmjs.com/package/axios

axios.post('/api/v1/auth/register', {
    email: 'this.carlhansen@gmail.com',
    username: 'this.carlhansen',
    password: '!6?nkRgQ*'
})
.then(res => console.log(res))
.catch(err => console.error(err));
```

# Log-in
Log's a user in.
- **Method** : `POST`
- **URL** : `/api/v1/auth/log-in`
- **Params** : `{ *email, *username, *password }`

## Success response
- **Code**: `200 OK` - Successfully logged in.

## Error responses
- **Code** : `400 Bad Request` - If one of the ff: email, username, password are falsy.
- **Code** : `404 Not Found` - If no user is associated with the ff: email, username. 
- **Code** : `401 Unauthorized` - If the password provided for the given email address is incorrect.

## Returns
- **Cookie** : `token` - An access token issued to the user.

## Example
```js
/* Axios */
const axios = require('axios'); // https://www.npmjs.com/package/axios

axios.post('/api/v1/auth/log-in', {
    email: 'this.carlhansen@gmail.com',
    username: 'this.carlhansen',
    password: '!6?nkRgQ*'
})
.then(res => console.log(res))
.catch(err => console.error(err));
```
## Note
- As of (7/8/21), you have to provide both email & username when logging in.

# Log-out
Log's a user out.
- **Method** : `DELETE`
- **URL** : `/api/v1/auth/log-out`

## Success response
- **Code** : `200 OK`- Successfully logged out.

## Error response
- **Code** : `404 Not Found` - When a user tries to log out even if they're not logged in to begin with.

## Example
```js
/* Axios */
const axios = require('axios'); // https://www.npmjs.com/package/axios

axios.delete('/api/v1/auth/log-out')
.then(res => console.log(res))
.catch(err => console.error(err));
```