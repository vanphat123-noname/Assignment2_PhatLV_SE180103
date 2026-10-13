const mongoose = require('mongoose');
const Loan = require('../models/Loan');
const Member = require('../models/Member');
const Book = require('../models/Book');

const LOAN_POPULATE = [
  { path: 'member_id' },
  { path: 'items.book_id' },
];

exports.GetAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate(LOAN_POPULATE);
    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.GetLoanById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid loan id" });
    }
    const loan = await Loan.findById(req.params.id).populate(LOAN_POPULATE);
    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }
    res.status(200).json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.GetLoansByMember = async (req, res) => {
  try {
    const { memberId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(memberId)) {
      return res.status(400).json({ error: "Invalid member id" });
    }

    const member = await Member.findById(memberId);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const loans = await Loan.find({ member_id: memberId }).populate(LOAN_POPULATE);
    res.status(200).json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.CreateLoan = async (req, res) => {
  try {
    const { member_id, items, dueDate } = req.body;

    if (!member_id) {
      return res.status(400).json({ error: "member_id is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(member_id)) {
      return res.status(400).json({ error: "Invalid member_id" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "items must be a non-empty array" });
    }
    if (!dueDate || isNaN(Date.parse(dueDate))) {
      return res.status(400).json({ error: "A valid dueDate is required" });
    }

    const member = await Member.findById(member_id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    for (const item of items) {
      if (!item.book_id) {
        return res.status(400).json({ error: "Each item requires a book_id" });
      }
      if (!mongoose.Types.ObjectId.isValid(item.book_id)) {
        return res.status(400).json({ error: `Invalid book_id: ${item.book_id}` });
      }
      if (!item.quantity || item.quantity < 1) {
        return res.status(400).json({ error: "Each item requires quantity >= 1" });
      }

      const book = await Book.findById(item.book_id);
      if (!book) {
        return res.status(404).json({ error: `Book not found: ${item.book_id}` });
      }
      if (book.availableCopies < item.quantity) {
        return res.status(400).json({
          error: `Not enough available copies for book: ${book.title}`,
        });
      }
    }

    const newLoan = new Loan({ member_id, items, dueDate });
    const savedLoan = await newLoan.save();

    for (const item of items) {
      await Book.findByIdAndUpdate(item.book_id, {
        $inc: { availableCopies: -item.quantity },
      });
    }

    await savedLoan.populate(LOAN_POPULATE);
    res.status(201).json(savedLoan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = exports;
