-- schema.sql

-- 🚀 USERS
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255),
  nickname VARCHAR(100),
  profile_image TEXT,
  bio TEXT,
  city VARCHAR(100),
  birthdate DATE,
  cpf VARCHAR(14),
  verified BOOLEAN DEFAULT FALSE,
  profile_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 💬 MESSAGES
CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255),
  nickname VARCHAR(100),
  text TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  likes INT DEFAULT 0,
  dislikes INT DEFAULT 0,
  parent_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 🏆 AWARDS
CREATE TABLE awards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id VARCHAR(255),
  award_type VARCHAR(100),
  awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 👑 ADMINS
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE
);
