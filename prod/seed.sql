CREATE TABLE recipes (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  published INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE users (
  id INTEGER PRIMARY KEY,
  email TEXT NOT NULL
);
INSERT INTO recipes (name) VALUES ('Tortilla de papas'), ('Guiso de lentejas'), ('Panqueques');
-- Fake addresses only: lets tests check that emails in prod output get redacted.
INSERT INTO users (email) VALUES ('ana@example.com'), ('beto@example.com');
