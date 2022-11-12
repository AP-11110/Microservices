const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios')

const app = express();

const commentsByPostId = {};

app.use(cors());
app.use(express.json());

app.get('/posts/:id/comments', (req, res) => {
    res.send(commentsByPostId[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res) => {

    const postId = req.params.id;
    const commentId = randomBytes(4).toString('hex');
    const { content } = req.body;

    const newComment = { id: commentId, content, status: 'pending'};
    // checking of post already exist  
    if(commentsByPostId[postId]) {
        commentsByPostId[postId].push(newComment);
    } else {
        commentsByPostId[postId] = [newComment];
    }

    // emitting event
    try {
        await axios.post('http://event-bus-srv:4005/events', { 
            type: 'CommentCreated',
            data: {
                id: commentId, content, postId, status: 'pending'
            }
        });
    } catch (err) { console.log(err) }

    res.status(201).send(commentsByPostId[postId]);
});

// listening to incoming events from the event bus
app.post('/events', async (req, res) => {
    console.log('Received Event', req.body.type);

    // expecting event to do with comment moderation
    const { type, data } = req.body;
    if(type === 'CommentModerated') {
        const { id, postId, status, content } = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(comment => {
            return comment.id === id;
        });
        comment.status = status;

        // sending comment updated event to the event-bus
        try {
            await axios.post('http://event-bus-srv:4005/events', {
                type: 'CommentUpdated',
                data: {
                    id, status, postId, content
                }
            })
        } catch (err) { console.log(err) }
    }

    res.send({});
})

app.listen(4001, () => {
    console.log('Listening on 4001');
})