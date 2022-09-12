import express from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import 'dotenv/config';
import cors from 'cors';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/interviewDB');

const questionSchema = {
  question: String,
};

const Question = mongoose.model("question", questionSchema);

const question1 = new Question({
  question: "Talk about a time when you had to work closely with someone whose personality was very different from yours."
});

const question2 = new Question({
  question: "Give me an example of a time you faced a conflict while working on a team. How did you handle that?"
});

const question3 = new Question({
  question: "Describe a time when you struggled to build a relationship with someone important. How did you eventually overcome that?"
});

const defaultQuestions = [question1, question2, question3];

const categorySchema = {
  name: String,
  questions: [questionSchema]
};

const Category = mongoose.model("category", categorySchema);

app.get("/api/questions", (req, res) => {
  Question.find({}, (err, allQuestions) => {
    if (allQuestions.length === 0) {
      Question.insertMany(defaultQuestions, err => {
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully insert default items");
          res.redirect("/");
        }
      })
    } else {
      res.json(allQuestions);
    }
  });
});

let port = process.env.PORT;
if (port == null || port == '') {
  port = 3001;
}

app.listen(port, (req, res) => {
  console.log(`I'm listening ${port}`);
})

