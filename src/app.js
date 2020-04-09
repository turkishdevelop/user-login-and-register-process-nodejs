/*Uygulamanın yönetileceği business katmanı*/

//Web uygulamalarında kullanılan express modülünü app.js dosyasına import ettik.
const express = require('express');
require('dotenv').config();


/*Uygulama değişkenlerinden aldığımız portu bir değişkene atadık.*/
const port = process.env.PORT;

/*User işlemlerinin yönlendirileceği router dosyasını dahil ettik*/
const userRouter = require('./routers/user');



/*db dosyasını dahil ettik.*/
require('./db/db');

/*express işlemlerini yönetmek için app değişkenine atadık.*/
const app = express();

/*gelen istekleri json tipinde route olarak parçaladık. yani her istek burdan geçecek*/
app.use(express.json());

/*User routera yönlendirme yapılıyor.*/
app.use("/",function (request,response,next) {

});

/*Uygulamanın 4000 portu üzerinde ayağa kalktığı kısım.*/
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});