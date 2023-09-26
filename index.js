const express = require("express");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./src/routes/routes.js");
const { dbconnect } = require("./src/database/dblogic.js");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    optionsSuccessStatus: 200,
  })
);

// ROUTING
app.get("/api/login", routes.login);

if (process.env.NODE_ENV === "production") {
  app.post("/api/callback", routes.productionCallback);
} else if (process.env.NODE_ENV === "development") {
  app.get("/api/callback", routes.developmentCallback);
}

app.post("/api/repos-to-badge", routes.reposToBadge);

app.get("/api/badgedRepos", routes.badgedRepos);

//Get user by name, email and username
app.get("/user", (req, res) => {
  res.send(
    `User ${req.params.user.name}, ${req.params.user.email}, ${req.params.user.username}`
  );
})(async () => {
  try {
    await dbconnect().then(() => {
      app.listen(process.env.PORT, () => {
        console.log(`server listening on port ${process.env.PORT}`);
      });
    });
  } catch (error) {
    console.log(error);
  }
})();
