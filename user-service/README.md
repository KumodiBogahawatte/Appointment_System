
# User Service - Role-based Access

## User Roles
Each user has a `role` field, which can be one of:
- `patient` (default)
- `doctor`
- `admin`

## Registration
You can specify a role during signup by including it in the request body:

```json
{
	"name": "John Doe",
	"email": "john@example.com",
	"password": "yourpassword",
	"role": "doctor" // optional, defaults to "patient"
}
```

## JWT Token
The JWT token now includes the user's role. Example payload:

```json
{
	"id": "user_id",
	"role": "admin"
}
```

## Role-based Middleware
To protect routes by role, use the `roleMiddleware`:

```js
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.get("/admin", auth, role(["admin"]), (req, res) => {
	// Only accessible by admin users
});
```

You can specify multiple allowed roles: `role(["admin", "doctor"])`
