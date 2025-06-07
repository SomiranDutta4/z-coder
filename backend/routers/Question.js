const express = require('express');
const router = express.Router();
const QuestionDB = require('../models/Question');
const mongoose = require('mongoose');

router.post('/', async (req, res) => {
    const questionData = new QuestionDB({
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tag,
        user: req.body.user
    })

    await questionData.save().then((doc) => {
        res.status(201).send({
            status: true,
            data: doc,
        })
    }).catch((err) => {
        res.status(400).send({
            status: false,
            message: "Error adding question",
        })
    })
})

router.get('/', async (req, res) => {
    QuestionDB.aggregate([
        {
            $lookup: {
                from: "comments",
                let: { question_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$question_id", "$$question_id"],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            comment: 1,
                            created_at: 1,
                        },
                    },
                ],
                as: "comments",
            },
        },
        {
            $lookup: {
                from: "answers",
                let: { question_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$question_id", "$$question_id"],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                        },
                    },
                ],
                as: "answerDetails",
            },
        },
        {
            $project: {
                __v: 0,
            },
        },
    ])
        .exec()
        .then((questionDetails) => {
            res.status(200).send(questionDetails);
        }).catch((e) => {
            console.log(e);
            res.status(400).send(e);
        })
})


router.get('/:id', async (req, res) => {
    try {
        QuestionDB.aggregate([
            {
                $match: { _id: new mongoose.Types.ObjectId(req.params.id) },
            },
            {
                $lookup: {
                    from: "answers",
                    let: { question_id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$question_id", "$$question_id"],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                user: 1,
                                answer: 1,
                                question_id: 1,
                                created_at: 1,
                                votes: 1  // ← include the votes map here
                            },
                        },
                    ],
                    as: "answerDetails",
                },
            },
            {
                $lookup: {
                    from: "comments",
                    let: { question_id: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ["$question_id", "$$question_id"],
                                },
                            },
                        },
                        {
                            $project: {
                                _id: 1,
                                question_id: 1,
                                user: 1,
                                comment: 1,
                                created_at: 1,
                            },
                        },
                    ],
                    as: "comments",
                },
            },
            {
                $project: {
                    __v: 0,
                },
            },
        ])
            .exec()
            .then((questionDetails) => {
                res.status(200).send(questionDetails);
            }).catch((e) => {
                console.log(e);
                res.status(400).send(e);
            })
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Question not found",
        });
    }
})

router.post('/:id/vote', async (req, res) => {
    const { userId, voteType } = req.body; // voteType: 1 = upvote, -1 = downvote

    if (![1, -1].includes(voteType)) {
        return res.status(400).json({ message: 'Invalid vote type' });
    }

    try {
        const question = await QuestionDB.findById(req.params.id);
        if (!question) {
            return res.status(404).json({ message: 'Question not found' });
        }

        const currentVote = question.votes.get(userId);

        if (currentVote === voteType) {
            question.votes.delete(userId); // toggle vote off
        } else {
            question.votes.set(userId, voteType); // set or switch
        }

        await question.save();

        // Calculate total votes (no negatives)
        let totalVotes = Array.from(question.votes.values()).reduce((sum, val) => sum + val, 0);
        totalVotes = Math.max(0, totalVotes);

        res.status(200).json({
            message: 'Vote updated successfully',
            totalVotes,
            votes: Object.fromEntries(question.votes),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while voting' });
    }
});


module.exports = router;