
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const OpenAI = require("openai");
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.KEY
});

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

async function runConversation(imagePath) {
  const messages = [
    {
      role: "system",
      content: "Here is an image, please describe what you see and give relevant information.",
    },
    {
      role: "user",
      content: imagePath,
    },
  ];
  
  const functions = [
    {
      name: "get_info",
      description: "Get information for a street",
      parameters: {
        type: "object",
        properties: {
          answer: {
            type: "object",
            properties: {
              title: { type: "string" },
              historyStreetName: { type: "string", description: "explain he history of why this street has this name in 50 caracteres" },
              paragraphs: {
                type: "object",
                properties: {
                  "0": { type: "string", description: "explain a general information" },
                  "1": { type: "string", description: "give a historical fact" },
                  "2": { type: "string", description: "give a fun fact, it's very important" },
                }
              }
            }
          }
        }
      }
    }
  ];

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages,
    functions: functions,
    function_call: "auto",
  });

  const responseMessage = response.choices[0].message;
  
  console.log("responseMessage", responseMessage);

  // if (responseMessage.function_call) {
  //   const functionResponse = JSON.parse(responseMessage.function_call.arguments);
  //   console.log("functionResponse", functionResponse);
  //   return functionResponse.answer;
  // }

  // return responseMessage.content;
}

const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  const filePath = req.file.path;

  try {
    if (!fs.existsSync(filePath)) {
      return res.status(400).json({ message: "No image found" });
    }

    const file = fs.readFileSync(filePath);
    const base64Image = file.toString('base64');

    const result = await runConversation(base64Image);

    fs.unlinkSync(filePath);
    console.log("result", result);
    res.json( result );

  } catch (error) {
    console.error("Error uploading image", error);
    return res.status(500).json({ message: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
