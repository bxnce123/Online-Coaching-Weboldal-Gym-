CREATE TABLE `users` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `email` varchar(255) UNIQUE,
  `password_hash` varchar(255),
  `role` varchar(255) COMMENT 'trainer / client / admin',
  `created_at` timestamp
);

CREATE TABLE `trainers` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `bio` text,
  `specialization` varchar(255),
  `hourly_rate` decimal
);

CREATE TABLE `clients` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `user_id` int,
  `birth_date` date,
  `height_cm` decimal,
  `weight_kg` decimal,
  `goal` varchar(255)
);

CREATE TABLE `workout_plans` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `trainer_id` int,
  `client_id` int,
  `title` varchar(255),
  `description` text,
  `start_date` date,
  `end_date` date
);

CREATE TABLE `exercises` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `name` varchar(255),
  `description` text,
  `muscle_group` varchar(255),
  `video_url` varchar(255)
);

CREATE TABLE `plan_exercises` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `plan_id` int,
  `exercise_id` int,
  `sets` int,
  `reps` int,
  `weight_kg` decimal,
  `day_of_week` int
);

CREATE TABLE `appointments` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `trainer_id` int,
  `client_id` int,
  `start_time` timestamp,
  `duration_minutes` int,
  `status` varchar(255) COMMENT 'scheduled / completed / cancelled',
  `created_at` timestamp
);

CREATE TABLE `payments` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `client_id` int,
  `amount` decimal,
  `paid_at` date,
  `status` varchar(255) COMMENT 'pending / paid / failed',
  `payment_method` varchar(255)
);

CREATE TABLE `progress_logs` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `client_id` int,
  `log_date` date,
  `weight_kg` decimal,
  `body_fat_percent` decimal,
  `notes` text
);

ALTER TABLE `trainers` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `clients` ADD FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

ALTER TABLE `workout_plans` ADD FOREIGN KEY (`trainer_id`) REFERENCES `trainers` (`id`);

ALTER TABLE `workout_plans` ADD FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`);

ALTER TABLE `plan_exercises` ADD FOREIGN KEY (`plan_id`) REFERENCES `workout_plans` (`id`);

ALTER TABLE `plan_exercises` ADD FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`);

ALTER TABLE `appointments` ADD FOREIGN KEY (`trainer_id`) REFERENCES `trainers` (`id`);

ALTER TABLE `appointments` ADD FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`);

ALTER TABLE `payments` ADD FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`);

ALTER TABLE `progress_logs` ADD FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`);
