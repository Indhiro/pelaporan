const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController')

userRouter.get('/login', userController.loginUser);
userRouter.get('/get-user', userController.getUser);
userRouter.get('/get-all-user', userController.getAllUser);
userRouter.post('/register', userController.registerUser);
userRouter.put('/update-pass', userController.updatePassUser);
userRouter.put('/update-user', userController.updateUser);
userRouter.put('/delete-user', userController.deleteUser);

module.exports = userRouter;