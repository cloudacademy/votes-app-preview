const express = require('express');
const app = express();
const {GoogleAuth} = require('google-auth-library');
const auth = new GoogleAuth();
require('dotenv').config();
app.use(express.json());

// Get PORT from environment variable
const PORT = process.env.PORT;
const VOTE_URL = process.env.VOTE_URL;
const VOTES_URL = process.env.VOTES_URL;

// Middleware to set Access-Control-Allow-Origin header on all APIs
app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', '*');
  next();
});

// OPTIONS method to allow all requests
app.options('*', (req, res) => {
  res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  res.send();
});

// GET method for health check
app.get('/', (req, res) => {
  res.send('OK');
});

// POST method for voting
app.post('/vote', async (req, res) => {
  try {
    const client = await auth.getIdTokenClient(VOTE_URL);
    const response = await client.request({
      url: VOTE_URL,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ vote: req.body.vote }),
    });
    return res.send(response.data);
  } catch (error) {
    console.error(error);
    reponse = error.response;
    return res.status(reponse.status).json({ message: `Couldn't reach backend: ${reponse.status} ${reponse.statusText}` });
  }
});

// GET method for retrieving vote count
app.get('/votes', async (_, res) => {
  try {
    const client = await auth.getIdTokenClient(VOTES_URL);
    const response = await client.request({ url: VOTES_URL });
    return res.send(response.data);
  } catch (error) {
    console.error(error);
    reponse = error.response;
    return res.status(reponse.status).json({ message: `Couldn't reach backend: ${reponse.status} ${reponse.statusText}` });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Vote URL is ${VOTE_URL}`);
  console.log(`Votes URL is ${VOTES_URL}`);
});
