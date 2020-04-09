/*Web işlemlerini yürütmek için express modülünü import ediyorum.*/
const express = require('express');
/*User modeli router işlemlerinde kullanacağımız veri gönderip veri alacağımız için import ediyorum.*/
const User = require('../models/user');

/*express modülünün router paramatresini router nesnesine atıyoruz.*/
const  router = express.Router();

router.post('/register',async (request,response)=>{
    //Register işlemleri isteğinin karşılanacağı router.
    try {
        /*JSON'a convert edilerek post'un body sine eklenen verileri request.body ile alarak user nesnesine atıyorum.*/
        const user = new User(request.body);
        /*kullanıcıyı kaydettiğimiz mongoose metodu.*/
        await user.save();
        /*kullanıcıya token üreterek eklediğimiz generate metodu*/
        const token = await user.generateAuthToken();
        /*kullanıcıyı ve token'i geri dönen metot*/
        response.status(201).send({user,token});
    }catch (e) {
        /*hata ile karşılaşılması durumunda kullanıcıya dönderilecek metot.*/
        response.status(e).send(e);
    }
    
});

router.post('/login',async (request,response)=>{
    //Kayıtlı kullanıcının login olduğu router
    try {
        /*request body ile gelen email ve password değerlerini alıyoruz.*/
        const {email,password} = request.body;
        /*kullanıcının sorgusunun yaplarak user nesnesine eklendiği metot*/
        const user = await User.findByCredentials(email,password);
        /*kullanıcı bulunamazsa response nesnesine hata eklenerek gönderilir.*/
        if (!user){
            return response.status(401).send({error:'Login Failed.'});
        }
        /*user modeli içerisinde tanımladığımız generateAuthToken ile token ürettiğimiz metot*/
        const token = await user.generateAuthToken();
        /*kullanıcıya bulunan user nesnesini ve token'i response send metodu ile gönderiyorum.*/
        response.send({user,token});
        /*hata ile karşılaşılırsa kullanıya gönderilecek e nesnesi ile hata sebebi okunur.*/
    }catch (e) {
        response.status(400).send(e);
    }

});
module.exports = router;