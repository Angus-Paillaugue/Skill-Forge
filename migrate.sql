USE skillforge;

ALTER TABLE `users` ADD `profile_picture` VARCHAR(255) NOT NULL DEFAULT '/profile_pictures/default_avatar.jpg' AFTER `username`;
