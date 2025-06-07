const express = require('express');
const router = express.Router();
const AnswerDB = require('../models/Answer');

router.post('/', async (req, res) => {
    const answerData = new AnswerDB({
        question_id: req.body.question_id,
        answer: req.body.answer,
        user: req.body.user
    })

    await answerData.save().then((doc) => {
        res.status(201).send({
            status: true,
            data: doc,
        })
    }).catch((err) => {
        res.status(400).send({
            status: false,
            message: "Error adding answer",
        })
    })
})

router.post('/vote', async (req, res) => {
    console.log(req.body);
    const { questionId, answerId, userId, voteType } = req.body;
    // voteType: 1 = upvote, -1 = downvote

    if (![1, -1].includes(voteType)) {
        return res.status(400).json({ message: 'Invalid vote type' });
    }

    if (!questionId || !answerId || !userId) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Find the answer by id and question_id (to ensure answer belongs to the question)
        const answer = await AnswerDB.findOne({ _id: answerId, question_id: questionId });
        if (!answer) {
            return res.status(404).json({ message: 'Answer not found for the given question' });
        }

        const currentVote = answer.votes.get(userId);

        if (currentVote === voteType) {
            answer.votes.delete(userId); // toggle vote off
        } else {
            answer.votes.set(userId, voteType); // set or switch vote
        }

        await answer.save();

        // Calculate total votes (sum of all vote values, capped at minimum 0)
        let totalVotes = Array.from(answer.votes.values()).reduce((sum, val) => sum + val, 0);
        totalVotes = Math.max(0, totalVotes);

        res.status(200).json({
            message: 'Vote updated successfully',
            totalVotes,
            votes: Object.fromEntries(answer.votes),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while voting on answer' });
    }
});

module.exports = router;