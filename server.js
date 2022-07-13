const express = require("express");

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Keep alive endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "HR API is alive!",
    payload: null,
  });
});

// Api routes
require("./api/routes/index")(app);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 500,
    message: "Sorry, something broke on our end...",
    payload: null,
  });
});

// Not Found handler
app.use((req, res, next) => {
  res.status(404).json({
    status: 404,
    message: "Sorry, this endpoint does not exist...",
    payload: null,
  });
});

// API listener
const server = app.listen(port, () => {
  console.log(`HR API up and running on port ${port}...`);
});

module.exports = server;
