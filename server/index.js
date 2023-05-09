import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Configuration, OpenAIApi } from "openai";

//components
import Connection from './database/db.js';
import Router from './routes/route.js';

const OPENAI_API_KEY="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";


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', Router);


const PORT = 8000;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;

const configuration = new Configuration({
    apiKey: OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  

Connection(username, password);


app.get("/ping", (req, res) => {
    res.json({
      message: "pong",
    });
  });
  app.post("/chat", (req, res) => {
    const question = req.body.question;
  
    openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: question,
        max_tokens: 4000,
        temperature: 0,
      })
      .then((response) => {
        // console.log({ response });
        return response?.data?.choices?.[0]?.text;
      })
      .then((answer) => {
        // console.log({ answer });
        const array = answer
          ?.split("\n")
          .filter((value) => value)
          .map((value) => value.trim());
  
        return array;
      })
      .then((answer) => {
        res.json({
          answer: answer,
          propt: question,
        });
      });
    // console.log({ question });
  });
    

app.listen(PORT, () => console.log(`Server is running successfully on PORT ${PORT}`));