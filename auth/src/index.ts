import express from 'express';

const app = express();

app.get('*', (req, res) => {
  res.send({});
});

app.listen(9994, () => {
  console.log('Listening on port 9994');
});
