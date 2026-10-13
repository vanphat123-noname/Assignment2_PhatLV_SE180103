const express = require('express');
const router = express.Router();
const LoanController = require('../controllers/LoanController');

router.get('/', LoanController.GetAllLoans);
router.get('/member/:memberId', LoanController.GetLoansByMember);
router.get('/:id', LoanController.GetLoanById);
router.post('/', LoanController.CreateLoan);

module.exports = router;
