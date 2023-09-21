const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const Workout = require("../models/Workout");
const workouts = require("../data");

beforeEach(async () => {
  await Workout.deleteMany({});
  let workoutObject = new Workout(workouts[0]);
  await workoutObject.save();
  workoutObject = new Workout(workouts[1]);
  await workoutObject.save();
});

describe("Workouts API", () => {
  describe("GET /", () => {
    test("should return type json", async () => {
      await request(app)
        .get("/workouts")
        .expect(200)
        .expect("Content-Type", /application\/json/);
    });

    test("should return all workouts", async () => {
      const res = await request(app).get("/workouts");

      expect(res.body).toHaveLength(workouts.length);
    });
  });

  describe("GET /:id", () => {
    test("should return a specific workout", async () => {
      const workoutResponse = await request(app).get("/workouts");
      const id = workoutResponse.body[0].id

      const response = await request(app)
        .get(`/workouts/${id}`)
        .expect(200)

      expect(response.body.date).toBe("28/8/2023")
      expect(response.body.id).toBe(id)

    })
  })

  describe("POST /", () => {
    test("should create a workout", async () => {
      const res = await request(app)
        .post("/workouts")
        .send({
          date: "18/9/2023",
          exercises: [{ name: "Weighted lunge", sets: [{ reps: 30, kg: 20 }] }],
        });
      expect(res.statusCode).toBe(201);

      const createdWorkout = await Workout.findById(res.body._id);
      expect(createdWorkout).toBeDefined();

      const updatedWorkouts = await Workout.find({});
      expect(updatedWorkouts.length).toBe(workouts.length + 1);
    });
  });

  describe("DELETE /:id", () => {
    test("should delete a specific workout", async () => {
      const newWorkout = await request(app)
        .post("/workouts")
        .send({
          date: "18/9/2023",
          exercises: [{ name: "Weighted lunge", sets: [{ reps: 30, kg: 20 }] }],
        });

      const res = await request(app).delete(`/workouts/${newWorkout.body.id}`);

      expect(res.statusCode).toBe(204);

      const deletedWorkout = await Workout.findById(newWorkout.body.id);
      expect(deletedWorkout).toBeNull();
    });
  });
});

describe("Exercises API", () => {
  describe("POST /:id/exercises", () => {
    test("should add an exercise to a workout", async () => {
      const workoutRes = await request(app).post("/workouts").send({
        date: "18/9/2023",
        exercises: [],
      });
      const workoutId = workoutRes.body.id;

      const exerciseData = {
        name: "Squat",
        sets: [
          { reps: 5, kg: 50 },
          { reps: 5, kg: 50 },
          { reps: 5, kg: 50 },
        ],
      };
      const response = await request(app)
        .post(`/workouts/${workoutId}/exercises`)
        .send(exerciseData);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty("id");

      const updatedWorkout = await Workout.findById(workoutId);

      const initialExerciseCount = workoutRes.body.exercises.length;
      const finalExerciseCount = updatedWorkout.exercises.length;

      expect(finalExerciseCount).toBe(initialExerciseCount + 1);
    });
  });

  describe("PUT /:workout_id/exercises/:exercise_id/sets", () => {
    test("should add a set to a specific exercise", async () => {
      const workoutResponse = await request(app).get("/workouts");
      const workout_id = workoutResponse.body[0].id
      const exercise_id = workoutResponse.body[0].exercises[0].id

      const setObject = {
        reps: 10,
        kg: 80
      }

      const response = await request(app)
        .put(`/workouts/${workout_id}/exercises/${exercise_id}/sets`)
        .send(setObject)
        .expect(200)
      
      expect(response.body.exercises[0].sets).toHaveLength(4)
      console.log(response.body.exercises[0].sets)
      // hox! kg is not added!
    })
  })
});

afterAll(async () => {
  await mongoose.connection.close();
});
