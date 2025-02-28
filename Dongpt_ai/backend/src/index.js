const express = require('express');
const DongptCore = require('./core');
const TextProcessor = require('./plugins/text-processor');

const app = express();
app.use(express.json());

const core = new DongptCore();
core.registerPlugin(new TextProcessor());

app.post('/process', async (req, res) => {
  const context = req.body;
  await core.run(context);
  res.json(context);
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});



