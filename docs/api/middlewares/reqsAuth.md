
― Middleware

# reqsAuth

Requires authorization from the user.

-  **Params** : `{ *token }`

## Error responses

-  **Code** : `400 Bad Request` - if token is either: `undefined`, `null`, `''`, `' '`.

-  **Code** : `404 Not Found` - If token does not exist.

## Example

```js

/* notr.js */
const reqsAuth = require('../middlewares/reqsAuth.js');

/* List a user's notr. */
router.get('/api/v1/user/:_id/notr/:id', reqsAuth, async (req, res) => {
    const { _id, id } = req.params;

    User.findById({ _id }, (err, user) => {
        if(err) return res.sendStatus(500);

        if(!user) return res.sendStatus(404);

        const notr = user.notrs.get(id);

        if(user.notrs.size >= 0) return res.sendStatus(204);

        res.status(200).send(notr);
    });
});
/* */
```