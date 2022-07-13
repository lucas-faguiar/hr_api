const jsonwebtoken = require("jsonwebtoken");

// Dummy secrets
const JWT_SECRET = "super-secret";
const registeredUsers = [
  { username: "admin", password: "admin", permission_level: 10 },
  { username: "junior", password: "junior", permission_level: 1 },
];

exports.login = (req, res) => {
  // Get user data
  const { username, password } = req.body;

  // Find registered user
  const validUser = registeredUsers.find((user) => user.username === username);

  // Validate and sign
  if (validUser?.password === password) {
    return res.status(200).json({
      status: 200,
      message: "Login was successful!",
      payload: jsonwebtoken.sign({ user: username }, JWT_SECRET),
    });
  }

  // Invalid credentials - send authentication error response
  return res.status(401).json({
    status: 401,
    message: "Your credentials are invalid...",
    payload: null,
  });
};

exports.verify = (required_permission_level = 1) => {
  return (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
      // No token - send authentication error response
      return res.status(401).json({
        status: 401,
        message: "Access denied, no authorization token provided...",
        payload: null,
      });
    }

    jsonwebtoken.verify(token.split(" ")[1], JWT_SECRET, (err, value) => {
      if (err) {
        // Invalid token - send authentication error response
        return res.status(401).json({
          status: 401,
          message: "Access denied, authorization token is invalid...",
          payload: null,
        });
      }

      // Test authorization
      const validUser = registeredUsers.find(
        (user) => user.username === value.user
      );

      if (
        !validUser ||
        validUser.permission_level < required_permission_level
      ) {
        // Invalid token - send authentication error response
        return res.status(403).json({
          status: 403,
          message:
            "Access denied, you have no permissions to access this resource...",
          payload: null,
        });
      }

      // Authenticated and authorized user
      next();
    });
  };
};
