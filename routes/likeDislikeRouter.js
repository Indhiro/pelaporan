const express = require('express');
const likeDislikeRouter = express.Router();
const likeDislikeController = require('../controllers/likeDislikeController');

likeDislikeRouter.get('/get-like-dislike', likeDislikeController.getLikeDislike);
likeDislikeRouter.post('/upload-like-dislike', likeDislikeController.uploadLikeDislike);
likeDislikeRouter.delete('/delete-like-dislike', likeDislikeController.deleteLikeDislike);

module.exports = likeDislikeRouter;

