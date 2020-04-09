/*Veritabanı işlemlerini yapacağımız ORM katmanı.*/
const mongoose = require('mongoose');
//mongo db sunucusuna bağlantı yaptığımız modül
mongoose.connect(process.env.DB_HOST, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
});