const express = require('express');
const axios = require('axios');

const app = express();
const requestTimeout = 1000;
const port = 8008;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get('/numbers', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'URL parameter is missing or invalid' });
  }

  const urls = Array.isArray(url) ? url : [url];
  const requests = urls.map(fetchData);

  try {
    const responses = await Promise.all(requests);
    const numbers = extractNumbers(responses);
    const sortedNumbers = sortNumbers(numbers);

    return res.json({ numbers: sortedNumbers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

async function fetchData(url) {
  try {
    const response = await axios.get(url, { timeout: requestTimeout });
    return response.data.numbers || [];
  } catch (error) {
    return [];  
  }
}

function extractNumbers(responses) {
  const numbers = [];
  for (const response of responses) {
    numbers.push(...response);
  }
  return Array.from(new Set(numbers));
}

function sortNumbers(numbers) {
  return numbers.sort((a, b) => a - b);
}
