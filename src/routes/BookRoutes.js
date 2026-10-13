const express = require('express');
const router = express.Router();
const BookController = require('../controllers/BookController');

router.get('/', BookController.GetAllBooks);
router.get('/:id', BookController.GetBookById);
router.post('/', BookController.CreateBook);
router.put('/:id', BookController.UpdateBook);
router.delete('/:id', BookController.DeleteBook);

module.exports = router;
