const express = require('express')
const router = express.Router();
const userRouter = require('./userRouter');
const laporanRouter = require('./laporanRouter');
const likeDislikeRouter = require('./likeDislikeRouter');
const commentRouter = require('./commentRouter');
const reportRouter = require('./reportRouter');
const chatRouter = require('./chatRouter');
const notificationRouter = require('./notificationRouter');

router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE')
        return res.status(200).json({});
    }
    next();
})

router.use('/user', userRouter);
router.use('/laporan', laporanRouter);
router.use('/like-dislike', likeDislikeRouter);
router.use('/comment', commentRouter);
router.use('/report', reportRouter);
router.use('/chat', chatRouter);
router.use('/notification', notificationRouter);

module.exports = router;