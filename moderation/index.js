const express = require("express")
const axios = require("axios")

const app = express();

app.use(express.json());

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    // temp moderated word
    const moderatedWord = 'orange';

    // managing content moderation after creation of each comment
    if(type === 'CommentCreated') {
        const status = data.content.includes(moderatedWord) ? 'rejected' : 'approved';
        try {
            await axios.post('http://event-bus-srv:4005/events', {
                type: 'CommentModerated',
                data: {
                    id: data.id,
                    postId: data.postId,
                    status,
                    content: data.content
                }
            })
        } catch (err) { console.log(err) }
    }

    res.send({});
})

app.listen(4003, () => {
    console.log('Listening on port 4003');
})