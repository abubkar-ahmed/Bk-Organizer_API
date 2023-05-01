import express from 'express';
import verifyJWT from '../middleware/verifyJwt';
const router = express.Router();
const boardController = require('../controllers/boardController');


router.route('/')
    .get(verifyJWT , boardController.getBoard)
    .post(verifyJWT , boardController.addNewBoard)
    .put(verifyJWT , boardController.updateBoard)

router.route('/:boardId')
    .delete(verifyJWT , boardController.deleteBoard)

module.exports = router