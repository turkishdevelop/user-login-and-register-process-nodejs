/*Kullanıcının modellendiği Model Katmanı*/
/*Mongoose modülünü import ediyoruz.*/
const mongoose = require('mongoose');
/*Mongoose Schema yı User değişkenine aktarıyoruz.*/
const User = mongoose.Schema;

/*Mongo DB veritabanına yazmak üzere kullanıcı şemasını tanımlıyoruz.*/
const user = new User({
    name:{type:String},
    username:{type:String},
    email:{type:String},
    password:{type:String}

});
/*Hazırladığımız kullanıcı modülünü kullanmak için export ediyoruz */
module.exports=mongoose.model("User",user);