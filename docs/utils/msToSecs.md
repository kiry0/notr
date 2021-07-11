― Middleware

# msToSecs

Converts milliseconds to seconds.
-  **Params** : `{ *ms }`

## Error responses
**TypeError** : `ms cannot be null, undefined or empty!` - If ms is null, undefined or empty.

## Returns
- **Seconds** : Type: number - Converted milliseconds to seconds. 

## Example

```js
/* main.js */
const msToSecs = require('../utils/msToSecs.js');

msToSecs(1000) // 1
```