Table users {
  id int [pk, increment]
  name varchar(255)
  email varchar(255) [unique]
  password_hash varchar(255)
  role varchar(255) [note: 'trainer / client / admin']
  created_at timestamp
}

Table trainers {
  id int [pk, increment]
  user_id int
  bio text
  specialization varchar(255)
  hourly_rate decimal
}

Table clients {
  id int [pk, increment]
  user_id int
  birth_date date
  height_cm decimal
  weight_kg decimal
  goal varchar(255)
}

Table workout_plans {
  id int [pk, increment]
  trainer_id int
  client_id int
  title varchar(255)
  description text
  start_date date
  end_date date
}

Table exercises {
  id int [pk, increment]
  name varchar(255)
  description text
  muscle_group varchar(255)
  video_url varchar(255)
}

Table plan_exercises {
  id int [pk, increment]
  plan_id int
  exercise_id int
  sets int
  reps int
  weight_kg decimal
  day_of_week int
}

Table appointments {
  id int [pk, increment]
  trainer_id int
  client_id int
  start_time timestamp
  duration_minutes int
  status varchar(255) [note: 'scheduled / completed / cancelled']
  created_at timestamp
}

Table payments {
  id int [pk, increment]
  client_id int
  amount decimal
  paid_at date
  status varchar(255) [note: 'pending / paid / failed']
  payment_method varchar(255)
}

Table progress_logs {
  id int [pk, increment]
  client_id int
  log_date date
  weight_kg decimal
  body_fat_percent decimal
  notes text
}

Table products {
  id int [pk, increment]
  client_id int
  name varchar(255)
  description text
  price decimal
  stock int
  category varchar(255)
  image_url varchar(500)
  created_at timestamp
}

Ref trainers_user_fk: trainers.user_id > users.id

Ref clients_user_fk: clients.user_id > users.id

Ref workout_plans_trainer_fk: workout_plans.trainer_id > trainers.id

Ref workout_plans_client_fk: workout_plans.client_id > clients.id

Ref plan_exercises_plan_fk: plan_exercises.plan_id > workout_plans.id

Ref plan_exercises_exercise_fk: plan_exercises.exercise_id > exercises.id

Ref appointments_trainer_fk: appointments.trainer_id > trainers.id

Ref appointments_client_fk: appointments.client_id > clients.id

Ref payments_client_fk: payments.client_id > clients.id

Ref progress_logs_client_fk: progress_logs.client_id > clients.id

Ref products_client_fk: products.client_id > clients.id
