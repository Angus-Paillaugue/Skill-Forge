USE skillforge;

ALTER TABLE `users` CHANGE `profile_picture` `profile_picture` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT '/profile_picture/default_avatar.jpg';
