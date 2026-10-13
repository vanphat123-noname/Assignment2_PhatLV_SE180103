const mongoose = require("mongoose");

const loanItemSchema = new mongoose.Schema(
  {
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    quantity: { type: Number, min: 1, required: true },
  },
  { _id: false }
);

const loanSchema = new mongoose.Schema(
  {
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Member",
      required: true,
    },
    items: [loanItemSchema],
    borrowDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date, default: null },
    status: {
      type: String,
      enum: ["Borrowing", "Returned", "Overdue"],
      default: "Borrowing",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Loan", loanSchema);

