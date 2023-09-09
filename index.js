const express = require("express");
var cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const PORT = 3001;

let workouts = [
  {
    date: "28/8/2023",
    exercises: [
      {
        exercise_id: "d6c8a9e7-9327-4096-aced-5e66b35e9fc6",
        name: "Barbell Row",
        sets: [
          {
            set_id: "3a208442-a66f-4353-bcab-589d234f3b66",
            reps: 5,
            kg: 52.5,
          },
          {
            set_id: "bd529c39-8470-4250-8e4f-71376d69f0ab",
            reps: 5,
            kg: 52.5,
          },
          {
            set_id: "b987ae7a-c5ff-4f41-9903-a2940b8bec77",
            reps: 6,
            kg: 52.5,
          },
        ],
      },
      {
        exercise_id: "668bfddf-b7f8-48a2-9e26-bfdc8bf3715a",
        name: "Squat",
        sets: [
          {
            set_id: "ef916551-9e84-4602-9324-770444bf1822",
            reps: 5,
            kg: 58.75,
          },
          {
            set_id: "09b6f7ce-be3d-4596-8ad5-690c4d04b703",
            reps: 5,
            kg: 58.75,
          },
          {
            set_id: "2e16a37a-339f-41ed-ae21-d7e0e0f53ac2",
            reps: 7,
            kg: 58.75,
          },
        ],
      },
      {
        exercise_id: "60b3d42c-e349-4ea7-ad51-08bbf72af0f1",
        name: "Bench Press",
        sets: [
          {
            set_id: "b99715d3-001d-4b45-a3f8-d806acf1f3e9",
            reps: 5,
            kg: 73.5,
          },
          {
            set_id: "365aae72-e20b-435e-915d-b65288d909d9",
            reps: 5,
            kg: 73.5,
          },
          {
            set_id: "5ab4fa27-5a38-4500-b180-48295437469d",
            reps: 6,
            kg: 73.5,
          },
        ],
      },
    ],
    id: 1,
  },
  {
    date: "30/8/2023",
    exercises: [
      {
        exercise_id: "3b1e8ee4-af17-4a99-b483-6618de44a2fb",
        name: "Overhead Press",
        sets: [
          {
            set_id: "5d298f98-2528-4637-96d1-7a1983ce91a6",
            reps: 5,
            kg: 37.5,
          },
          {
            set_id: "10bf0728-0c12-4d7e-858a-6a08544bf328",
            reps: 5,
            kg: 37.5,
          },
          {
            set_id: "6b09caad-d5b6-4fbb-84d2-6348ce28add5",
            reps: 8,
            kg: 37.5,
          },
        ],
      },
      {
        exercise_id: "7a791e7e-fee2-4333-b94b-a4f085bc305f",
        name: "Weighted Chinups",
        sets: [
          {
            set_id: "2579eef8-47db-4e0b-8d50-9775d405fddc",
            reps: 5,
            kg: 16.25,
          },
          {
            set_id: "fb751d22-4c58-423a-8b79-390f465abddb",
            reps: 5,
            kg: 16.25,
          },
          {
            set_id: "7b0f8763-187d-4a71-8761-0df26390b1b9",
            reps: 5,
            kg: 5,
          },
        ],
      },
      {
        exercise_id: "e8d41ac6-1518-458b-b01d-6304dcb279ea",
        name: "Deadlift",
        sets: [
          {
            set_id: "cbb83798-d737-4199-baa4-9c99ec3c4839",
            reps: 7,
            kg: 62.5,
          },
        ],
      },
    ],
    id: 2,
  },
];

app.get("/", (req, res) => {
  res.send("Homepage");
});

// get all workouts
app.get("/workouts", (req, res) => {
  res.json(workouts);
});

// get a specific workout
app.get("/workouts/:id", (req, res) => {
  const id = req.params["id"];
  const workout = workouts.find((workout) => workout.id == id);
  res.json(workout);
});

// add a new workout
app.post("/workouts", (req, res) => {
  const workout = req.body;
  res.json(workout);
});

// add a new exercise to a specific workout
app.post("/workouts/:id/exercises", (req, res) => {
  const id = Number(req.params.id);
  const exerciseObject = req.body;

  const workout = workouts.find((workout) => workout.id === id);

  if (!workout) {
    return res.status(404).json({ error: "Workout not found" });
  }

  workout.exercises.push(exerciseObject);

  res.json(workout);
});

// add a new set to a specific exercise inside a specific workout
app.put("/workouts/:workout_id/exercises/:exercise_id/sets", (req, res) => {
  const workout_id = Number(req.params.workout_id);
  const exercise_id = req.params.exercise_id;
  const { set_id, reps, load } = req.body;

  const workout = workouts.find((workout) => workout.id === workout_id);

  if (!workout) {
    return res.status(404).json({ error: "Workout not found" });
  }

  const exercise = workout.exercises.find((e) => e.exercise_id === exercise_id);

  if (!exercise) {
    return res.status(404).json({ error: "Exercise not found" });
  }

  const newSet = {
    set_id,
    reps: parseFloat(reps),
    kg: parseFloat(load),
  };

  exercise.sets.push(newSet);

  res.json(workout);
  console.log(json(workout));
});

// delete a specific workout
app.delete("/workouts/:id", (req, res) => {
  const id = Number(req.params.id);
  workouts = workouts.filter((workout) => workout.id !== id);
  res.status(204).end();
});

// delete a specific exercise inside a specific workout
app.delete("/workouts/:workout_id/exercises/:exercise_id", (req, res) => {
  const workout_id = Number(req.params.workout_id);
  const exercise_id = req.params.exercise_id;

  const workout = workouts.find((workout) => workout.id === workout_id);

  if (!workout) {
    return res.status(404).json({ error: "Workout not found" });
  }

  workout.exercises = workout.exercises.filter(
    (exercise) => exercise.exercise_id !== exercise_id
  );

  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});

// delete a specific set inside a specific exercise
app.delete(
  "/workouts/:workout_id/exercises/:exercise_id/sets/:set_id",
  (req, res) => {
    const workout_id = Number(req.params.workout_id);
    const exercise_id = req.params.exercise_id;
    const set_id = req.params.set_id;

    const workout = workouts.find((workout) => workout.id === workout_id);

    if (!workout) {
      return res.status(404).json({ error: "Workout not found" });
    }

    const exercise = workout.exercises.find(
      (e) => e.exercise_id === exercise_id
    );

    if (!exercise) {
      return res.status(404).json({ error: "Exercise not found" });
    }

    exercise.sets = exercise.sets.filter((set) => set.set_id !== set_id);

    res.status(204).end();
  }
);
