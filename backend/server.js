const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes     = require('./routes/auth');
const productRoutes  = require('./routes/products');
const reviewRoutes   = require('./routes/reviews');
const userRoutes     = require('./routes/users');

// DEBUG - lihat isi objectnya
console.log('auth:', authRoutes);
console.log('products:', productRoutes);
console.log('users:', userRoutes);

const app = express();
// ... sisanya sama

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews',  reviewRoutes);
app.use('/api/users',    userRoutes);

app.get('/', (req, res) => res.json({ message: 'Sportiva API Running ✅' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));