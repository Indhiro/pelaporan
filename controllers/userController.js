const userModel = require('../models/userModel');

class userController {
    static loginUser(req, res, next) {
        userModel.loginUser(req, res, next);
    };

    static getUser(req, res, next) {
        userModel.getUser(req, res, next);
    };

    static getAllUser(req, res, next) {
        userModel.getUser(req, res, next);
    };

    static registerUser(req, res, next) {
        userModel.registerUser(req, res, next);
    };

    static updatePassUser(req, res, next) {
        userModel.updatePassUser(req, res, next);
    };

    static updateUser(req, res, next) {
        userModel.updateUser(req, res, next);
    };
    
    static deleteUser(req, res, next) {
        userModel.deleteUser(req, res, next);
    };

    static activeValidateUser(req, res, next) {
        userModel.activeValidateUser(req, res, next);
    };
    
}

module.exports = userController;