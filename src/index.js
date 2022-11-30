const express = require('express');
const app = express();
const Joi = require('joi');
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.listen(3000, () => console.log("Listening at 3000"));