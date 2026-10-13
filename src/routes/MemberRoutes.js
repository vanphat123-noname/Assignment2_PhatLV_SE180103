const express = require('express');
const router = express.Router();
const MemberController = require('../controllers/MemberController');

router.get('/', MemberController.GetAllMembers);
router.get('/:id', MemberController.GetMemberById);
router.post('/', MemberController.CreateMember);
router.put('/:id', MemberController.UpdateMember);
router.delete('/:id', MemberController.DeleteMember);

module.exports = router;
