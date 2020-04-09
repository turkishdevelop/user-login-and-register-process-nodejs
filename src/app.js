/*Uygulamanın yönetileceği business katmanı*/

//Web uygulamalarında kullanılan express modülünü app.js dosyasına import ettik.
const express = require('express');

/*.env dosyasındaki değişkenlere erişmek için kullanılan dotenv modülü*/
require('dotenv').config();

/*request body sinden gelen form verilerini parse etmek için eklediğimiz modül*/
const  bodyParser =require('body-parser');


/*Uygulama değişkenlerinden aldığımız portu bir değişkene atadık.*/
const port = process.env.PORT;

/*User işlemlerinin yönlendirileceği router dosyasını dahil ettik*/
const userRouter = require('./routers/user');


/*db dosyasını dahil ettik.*/
require('./db/db');

/*express işlemlerini yönetmek için app değişkenine atadık.*/
const app = express();

/*url encoded ederek veri post ederken body ile gelen json veriyi parçalamak için kullandım*/
app.use(bodyParser.urlencoded());

/*gelen istekleri json tipinde route olarak parçaladık. yani her istek burdan geçecek*/
app.use(express.json());

/*User routera yönlendirme yapılıyor.*/
app.use("/api",userRouter);

/*Uygulamanın 4000 portu üzerinde ayağa kalktığı kısım.*/
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});