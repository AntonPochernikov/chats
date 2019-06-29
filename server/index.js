const fs = require('fs').promises;
const express = require('express');
const app = express();
const expressWs = require('express-ws')(app)
const aWss = expressWs.getWss('/');
const uuidv1 = require('uuid/v1');

const port = 8081;
const reverse = arr => arr.reduceRight((acc, item) => acc.concat(item), []);

const init = async () => {
  let messages = [];
  try {
    const data = await fs.readFile('./messages.json', 'utf-8');
    messages = JSON.parse(data)
  } catch (err) {
    console.log(err);
    return;
  }

  app.ws('/messages', (ws, req, next) => {
    ws.on('message', (msg) => {
      const parsed = JSON.parse(msg);
      const withId = { id: uuidv1(), ...parsed };
      messages.unshift(withId);
      aWss.clients.forEach((client) => {
        client.send(JSON.stringify(withId));
      });
    });
  });

  app.get('/messages', async (req, res) => {
    res.set({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    });
    if (req.query.id) {
      const current = messages.find(m => m.id === req.query.id);
      const i = messages.indexOf(current);
      const nextMessages = messages.slice(i + 1, i + 21);
      try {
        res.json(reverse(nextMessages.slice(0, 20)));
        return
      } catch (e) {
        console.log(e);
        return;
      }
    }
    try {
      res.json(reverse(messages.slice(0, 20)));
    } catch (e) {
      console.log(e);
    }
  });

  app.listen(port, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(`Server is listening on port ${port}!`);
  });
};

init();
