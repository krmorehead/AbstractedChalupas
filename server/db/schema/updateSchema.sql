-- current update
USE weTubeMainDb;
-- USE weTubeSessions

CREATE TABLE friendRequests (
  id int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (ID),
  userId1 int,
  FOREIGN KEY(userId1) REFERENCES users(id),
  userId2 int,
  FOREIGN KEY(userId2) REFERENCES users(id)  
)

-- ALTER TABLE userSessions ADD COLUMN currentlyWatching varchar (200);

-- ALTER TABLE users DROP COLUMN email;

-- ALTER TABLE users CHANGE userName email varchar(200);


-- ALTER TABLE users DROP COLUMN name;
-- ALTER TABLE users ADD COLUMN userName varchar(200) NOT NULL;
-- ALTER TABLE users ADD COLUMN displayName varchar(200) NOT NULL;

-- example update

-- ALTER TABLE users ADD profile_photo varchar(300);
-- ALTER TABLE users DROP COLUMN social;

-- ALTER TABLE users DROP COLUMN social_investment;

-- ALTER TABLE users ADD social int DEFAULT 5;

-- CREATE TABLE tablename (
--   /* stores the current stocks for all users */
--   PRIMARY KEY (ID)
-- );