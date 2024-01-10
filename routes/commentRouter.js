const express = require('express');
const commentRouter = express.Router();
const commentController = require('../controllers/commentController');

commentRouter.get('/get-comment', commentController.getComment);
commentRouter.post('/upload-comment', commentController.uploadComment);
commentRouter.put('/update-comment', commentController.updateComment);
commentRouter.delete('/delete-comment', commentController.deleteComment);

module.exports = commentRouter;

