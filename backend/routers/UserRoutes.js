const express = require('express');
const User = require('../models/User');
const router = express.Router();
const Questions = require('../models/Question');  // adjust path as needed

router.post('/create', async (req, res) => {
    console.log("Creating user");

    const uid = req.body.uid;
    const bio = req.body.bio;

    const user = await User.findOne({ uid: uid });

    if (!user) {
        const userData = new User({
            uid: uid,
            bio: bio,
            bookmarks:[]
        })

        await userData.save().then((doc) => {
            res.status(201).send({
                status: true,
            })
        }).catch((err) => {
            res.status(400).send({
                status: false,
                message: "Error creating user",
            })
            console.log(err);
        })
    }
});

router.get('/bio', async (req, res) => {
    try {
        const uid = req.query.uid;
        // console.log(uid);
        const user = await User.findOne({ uid: uid });
        // console.log(user);

        if (!user) {
            return res.status(404).send("User not found");
        }

        const bioData = user.bio;
        // console.log(bioData);
        res.status(200).send(bioData);
    } catch (error) {
        console.log(error);
        res.status(400).send("Error occurred");
    }
});


router.put('/update', async (req, res) => {
    try {
        const uid = req.body.uid;
        const bio = req.body.bio;
        await User.findOneAndUpdate({ uid: uid }, { bio: bio }, { new: true });
        res.status(200).json({ message: "Bio updated successfully" }); // Respond with a message
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// GET /api/questions/user/:uid
router.get('/questions/:uid', async (req, res) => {
    console.log(req.params)
    const { uid } = req.params;

    try {
        // Find all questions where user.uid matches param uid
        const questions = await Questions.find({ 'user.uid': uid })
            .sort({ created_at: -1 }); // newest first

        res.status(200).json(questions);
    } catch (error) {
        console.error('Error fetching user questions:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
