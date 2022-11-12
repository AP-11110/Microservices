const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require("axios")

const app = express();

const posts = {};

app.use(cors());
app.use(express.json());

app.get('/posts', (req, res) => {
    res.send(posts);
});

app.post('/posts/create', async (req, res) => {

    // 4 bytes of random data converted to string
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = { id, title };

    // emitting event
    try{
        await axios.post('http://event-bus-srv:4005/events', { 
            type: 'PostCreated',
            data: {
                id, title
            }
        });
    } catch(err) { console.log(err) }

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);

    res.send({});
})

app.listen(4000, () => {
    console.log('v2');
    console.log('Listening on 4000');
})