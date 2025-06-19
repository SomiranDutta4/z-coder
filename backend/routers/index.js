const express = require('express');
const router = express.Router();

const questionRouter = require('./Question');
const answerRouter = require('./Answer');
const commentRouter = require('./Comment');
const contestsRouter = require('./Calendar');
const userRouter = require('./UserRoutes');
const codeRouter = require('./CodeEditor');
const practiseRouter = require('./practise');

router.get('/', (req, res) => {
    res.send("Hello from ZCoder Backend");
});

router.use('/question', questionRouter);
router.use('/answer', answerRouter);
router.use('/comment', commentRouter);
router.use('/contests', contestsRouter);
router.use('/users', userRouter);
router.use('/code', codeRouter);
router.use('/practise', practiseRouter);
module.exports = router;