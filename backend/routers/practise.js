const express = require('express');
const router = express.Router();
const axios = require("axios");
const User = require('../models/User'); // adjust path as needed
const Practise = require('../models/Practise'); // adjust path as needed

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";

router.get('/getProfile', async (req, res) => {
    // You can implement this later
    res.send("getProfile not implemented yet");
});
const QUESTION_QUERY = `
  query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
    problemsetQuestionList: questionList(
      categorySlug: $categorySlug
      limit: $limit
      skip: $skip
      filters: $filters
    ) {
      total: totalNum
      questions: data {
        title
        titleSlug
        difficulty
        acRate
        status
        paidOnly: isPaidOnly
        topicTags {
          name
          slug
        }
      }
    }
  }
`;
// router.get('/questions/DSA', async (req, res) => {
//     const url = 'https://backend.takeuforward.org/api/sheets/double/strivers_a2z_sheet';

//     try {
//         const response = await axios.get(url);
//         const questionsData = response.data || [];

//         res.status(200).json({
//             success: true,
//             message: "Fetched DSA questions successfully",
//             data: questionsData
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching DSA questions", error: error.message });
//     }
// });

router.post('/questions/DSA', async (req, res) => {
    let { page } = req.query
    let { topicSlug } = req.body;
    if (!topicSlug) topicSlug = "";

    const variables = {
        categorySlug: "",
        skip: (page - 1) * 10,
        limit: 10,
        filters: {
            tags: topicSlug
        }
    }

    try {
        const response = await axios.post(LEETCODE_GRAPHQL_URL, {
            query: QUESTION_QUERY,
            variables: variables
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const questions = response.data.data.problemsetQuestionList;
        res.status(200).json(questions);
    }
    catch (error) {
        console.error("Error fetching questions:", error.message);
        res.status(500).json({ error: "Failed to fetch questions from LeetCode" });
    }
});

router.get('/bookmarks/all', async (req, res) => {
    const { uid } = req.query;
    if (!uid) {
        return res.status(400).json({ error: "Missing uid" });
    }
    try {
        // Step 1: Find user
        const user = await User.findOne({ uid })
        .populate('bookmarks');
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        // Step 2: Return bookmarks
        res.status(200).json(user.bookmarks);
    } catch {
        res.status(500).json({ error: "Failed to fetch bookmarks" });
    }
})

router.post('/bookmark/question', async (req, res) => {
    const { uid, question, bookmark } = req.body;

    if (!uid || !question || !question.titleSlug || typeof bookmark !== 'boolean') {
        return res.status(400).json({ error: "Missing uid, question data, or bookmark flag" });
    }

    try {
        // Step 1: Ensure question exists
        let existing = await Practise.findOne({ titleSlug: question.titleSlug });

        if (!existing) {
            existing = new Practise({
                title: question.title,
                titleSlug: question.titleSlug,
                difficulty: question.difficulty,
                acRate: question.acRate,
                status: question.status || 'Not Started',
                paidOnly: question.paidOnly || false,
                topicTags: question.topicTags || []
            });
            await existing.save();
        }

        // Step 2: Find user
        const user = await User.findOne({ uid });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const index = user.bookmarks.indexOf(existing._id);

        if (bookmark) {
            // Add bookmark if not already bookmarked
            if (index === -1) {
                user.bookmarks.push(existing._id);
                await user.save();
            }
            return res.status(200).json({ message: "Bookmarked successfully", action: 'added', questionId: existing._id });
        } else {
            // Remove bookmark if it exists
            if (index !== -1) {
                user.bookmarks.splice(index, 1);
                await user.save();
            }
            return res.status(200).json({ message: "Bookmark removed successfully", action: 'removed', questionId: existing._id });
        }
    } catch (error) {
        console.error("Bookmark error:", error.message);
        res.status(500).json({ error: "Failed to update bookmark" });
    }
});


module.exports = router;
