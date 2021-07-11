
― Middleware

# limiter

Limit user requests interval.

-  **Params** : `{ *tokens, *interval, ?seconds=60*60, ?message='Too many requests, please try again later.', ?statusCode=429, ?setHeader=true }`

## Error responses

-  **Code** : `429 Too Many Requests` - if the user does not have enough tokens.

## Example

```js

/* notr.js */
const limiter = require('../middlewares/limiter.js');

/* List a user's notrs. */
router.get('/api/v1/user/:_id/notrs', [reqsAuth, limiter({ tokens: 2, interval: 10 })], async (req, res) => {
    const { _id } = req.params;
    
    if(!_id) return res.sendStatus(400);

    const user = await User.findById({ _id });

    if(!user) return res.sendStatus(404);

    const notrs = user.notrs;

    if(notrs.length <= 0) return res.sendStatus(204);

    res.status(200).send(notrs);
});
/* */
```