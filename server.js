require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/db');
const BookRoutes = require('./src/routes/BookRoutes');
const MemberRoutes = require('./src/routes/MemberRoutes');
const LoanRoutes = require('./src/routes/LoanRoutes');

const app = express();

connectDB();

app.use(express.json());
app.use('/api/books', BookRoutes);
app.use('/api/members', MemberRoutes);
app.use('/api/loans', LoanRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
