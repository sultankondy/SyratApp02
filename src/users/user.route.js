const User = require('./user.entity');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./auth/verifyToken');
const router = require('express').Router();
const userController = require('./user.controller');

router.route('/:id', verifyTokenAndAuthorization)
    .put(userController.updateUser)  // UPDATE USER 
    .delete(userController.deleteUser) // DELETE USER

// GET USER
router.get("/find/:id", verifyTokenAndAdmin, userController.getUser);
// GET ALL USERS
router.get("/", verifyTokenAndAdmin, userController.getAllUser);



module.exports = router;