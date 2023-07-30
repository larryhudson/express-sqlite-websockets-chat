import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import redis from "redis";
import RedisStore from "connect-redis";
import { authenticateUser, createUser } from "./auth.js";

const redisClient = redis.createClient();

const app = express();
const port = 3000;

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({ client: redisClient }),
  })
);

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.get("/login", (_, res) => {
  res.send(`<html><body><form method="POST">
<input type="text" name="username" />
<input type="password" name="password" />
<input type="submit" value="Login" />
</form></body></html>`);
});

app.get("/register", (_, res) => {
  res.send(`<html><body><form method="POST">
<input type="text" name="username" />
<input type="password" name="password" />
<input type="password" name="password2" />
<input type="submit" value="Register" />
</form></body></html>`);
});

app.get("/dashboard", (req, res) => {
  const { user } = req.session;
  if (!user) {
    res.status(401).send("Authentication failed");
  }

  res.send(`Hello ${user.username}`);
});

app.post("/register", async (req, res) => {
  console.log(req.body);
  const { username, password, password2 } = req.body;
  if (password !== password2) {
    res.status(400).send("Passwords do not match");
  }

  const user = await createUser(username, password);

  if (!user) {
    res.status(400).send("User already exists");
  }

  req.session.user = user;
  res.status(302).redirect("/dashboard");
});

app.post("/login", async (req, res) => {
  // get the username and password from the request
  const { username, password } = req.body;
  // authenticate the user
  const user = await authenticateUser(username, password);

  if (!user) {
    res.status(401).send("Authentication failed");
    return;
  } else {
    req.session.user = user;
    res.status(302).redirect("/dashboard");
  }
});

app.listen(port);
