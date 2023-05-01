import express from 'express';
import verifyJWT from '../middleware/verifyJwt';
const router = express.Router();
const taskController = require('../controllers/taskController');

router.route('/')
    .post(verifyJWT , taskController.addNewTask)
    .put(verifyJWT , taskController.editeTask)

router.route('/:boardId/:columnId/:taskId')
    .delete(verifyJWT , taskController.deleteTask)

router.route('/subTask')
    .put(verifyJWT , taskController.editeSubTask)

module.exports = router ;