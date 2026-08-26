const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/mercadopago', require('./routes/mercadopago'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`MercadoPago backend listening on ${PORT}`));
