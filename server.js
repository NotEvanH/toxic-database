const express = require('express');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(express.json());

app.post('/addData', (req, res) => {
  const newData = req.body;

  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    let jsonData = JSON.parse(data);
    let found = false;

    jsonData.forEach((entry) => {
      if (entry.name === newData.name) {
        entry.toxic = newData.toxic;
        entry.coins = newData.coins;

        found = true;
      }
    });

    if (!found) {
      jsonData.push(newData);
    }

    fs.writeFile('data.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error writing JSON file');
        return;
      }
      res.status(200).send('Data added successfully');
    });
  });
});

app.get('/getPlayerData/:name', (req, res) => {
  const playerName = req.params.name;

  fs.readFile('data.json', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error reading JSON file');
      return;
    }

    const jsonData = JSON.parse(data);
    const playerData = jsonData.find((entry) => entry.name === playerName);

    if (playerData) {
      res.status(200).json(playerData);
    } else {
      res.status(404).send('Player data not found');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
