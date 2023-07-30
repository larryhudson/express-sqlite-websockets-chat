import db from "./db.js";
import bcrypt from "bcrypt";

async function findUserByUsername(username) {
  return db.prepare("SELECT * FROM users WHERE username = ?").get(username);
}

export async function createUser(username, password) {
  const hashedPassword = await hashPassword(password);
  const sql = `INSERT INTO users (username, password) VALUES ($username, $hashedPassword)`;
  const statement = db.prepare(sql);
  return statement.run({ username, hashedPassword });
}

async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

async function comparePasswords(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export async function authenticateUser(username, password) {
  const user = await findUserByUsername(username);
  if (!user || !(await comparePasswords(password, user.password))) {
    return null; // Authentication failed
  }
  return user;
}

export async function saveSessionData(redisClient, sessionId, sessionData) {}
