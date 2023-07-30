import Database from "better-sqlite3";

// setup Database
const db = new Database("database.db", {
  verbose: console.log,
});

export async function initialiseDatabase() {
  const createSqls = [
    `
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT NOT NULL UNIQUE,
password TEXT NOT NULL
)`,
    `CREATE TABLE IF NOT EXISTS friends (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER NOT NULL,
friend_id INTEGER NOT NULL,
FOREIGN KEY (user_id) REFERENCES users(id),
FOREIGN KEY (friend_id) REFERENCES users(id),
UNIQUE (user_id, friend_id)
)`,
    `CREATE TABLE IF NOT EXISTS chats (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL UNIQUE,
description TEXT NOT NULL,
created_at INTEGER NOT NULL,
creator INTEGER NOT NULL,
FOREIGN KEY (creator) REFERENCES users(id)
)`,
    `CREATE TABLE IF NOT EXISTS chat_members (
id INTEGER PRIMARY KEY AUTOINCREMENT,
chat_id INTEGER NOT NULL,
user_id INTEGER NOT NULL,
FOREIGN KEY (chat_id) REFERENCES chats(id),
FOREIGN KEY (user_id) REFERENCES users(id),
UNIQUE (chat_id, user_id)
)`,
    `CREATE TABLE IF NOT EXISTS messages (
id INTEGER PRIMARY KEY AUTOINCREMENT,
chat_id INTEGER NOT NULL,
user_id INTEGER NOT NULL,
message TEXT NOT NULL,
timestamp INTEGER NOT NULL,
FOREIGN KEY (chat_id) REFERENCES chats(id),
FOREIGN KEY (user_id) REFERENCES users(id)
)`,
  ];

  for (const sql of createSqls) {
    const statement = db.prepare(sql);
    statement.run();
  }
}

initialiseDatabase();

export default db;
