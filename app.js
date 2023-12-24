const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors')
const app = express();
const PORT = 3001;

mongoose.connect('mongodb://127.0.0.1:27017/googlePayClone');

app.use(cors({
  origin:'http://localhost:3000', 
  credentials:true,
  optionSuccessStatus:200
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
