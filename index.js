const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
require('./models/Todo');
const todoRouter = require('./routers/todos');

const app = express();
const PORT = 5000;
const MONGO_URI = process.env.mongo_uri;

app.use(cors());
app.use(express.json());
app.use('/todos', todoRouter);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

async function startServer() {
  try {
    if (!MONGO_URI) {
      throw new Error('mongo_uri 환경변수가 설정되지 않았습니다.');
    }

    mongoose.connection.once('connected', () => {
      console.log('연결 성공');
    });

    await mongoose.connect(MONGO_URI);

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('MongoDB 연결 실패:', error.message);
    process.exit(1);
  }
}

startServer();
