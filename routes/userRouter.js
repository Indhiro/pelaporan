const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController')
const { uploadFile } = require('../helpers/helpers')

userRouter.post('/login', userController.loginUser);
userRouter.get('/get-user', userController.getUser);
userRouter.get('/get-all-user', userController.getAllUser);
userRouter.post('/register', userController.registerUser);
userRouter.put('/update-pass', userController.updatePassUser);
userRouter.put('/update-user', uploadFile().single("file"), userController.updateUser);
userRouter.put('/delete-user', userController.deleteUser);
userRouter.get('/validate-user', userController.activeValidateUser);

module.exports = userRouter;