/*Veritabanına şema oluşturmak için mongoose modülünü entegre ettik*/
const mongoose = require('mongoose');
/*Kullanıcıdan gelen email password gibi verilerde Regex işlemler(doğrulama) yapmak için validator modülünü entegre ettik*/
const validator = require('validator');
/*Kullanıcının şifresini hashlemek için bcrypt modülünü dahil ettik*/
const bcrypt = require('bcryptjs');
/*kullanıcıya token eklemek için jsonwebtoken modülünü dahil ettik*/
const jwt = require('jsonwebtoken');

/*Veritabanına ekleyeceğimiz kullanıcı şemasını oluşturuyoruz*/
const userSchema = mongoose.Schema({
    /*name isimli değişken kullanıcının adını kapsayacak*/
    name: {
        /*type olarak string belirlendi kullanıcıdan gelen veri string olarak yorumlanacak*/
        type: String,
        /*required parametresi ile verinin alınması zorunlu yapıldı*/
        required: true,
        /*trim parametresi ile kullanıcıdan gelen verinin başındaki ve sonundaki boşluklar silindi.*/
        trim: true,
    },
    email: {
        /*type olarak string belirlendi kullanıcıdan gelen veri string olarak yorumlanacak*/
        type: String,
        /*required parametresi ile verinin alınması zorunlu yapıldı*/
        required: true,
        /*unique parametresi ile veritabanında email adresinin birden fazla kullanılması engelleniyor*/
        unique:true,
        /*gelen email verisinin lowercase olması sağlandı.*/
        lowercase: true,
        /*validator modülü ile gelen verinin email tipinde olup olmadığı kontrol ediliyor. eğer email değilse hata fırlatıyor*/
        validate: value => {
            if (!validator.isEmail(value)) {
                throw new Error({error: 'Invalid email adress'});
            }
        },
    },

    password: {
        /*type olarak string belirlendi kullanıcıdan gelen veri string olarak yorumlanacak*/
        type: String,
        /*required parametresi ile verinin alınması zorunlu yapıldı*/
        required: true,
        /*minLength parametresi ile şifrenin en az 7 haneli olması sağlandı.*/
        minLength: 7,
    },

    /*tokenler şeklinde tanımlanan dizi içerisine kullanıcının kayıt olduktan sonraki token bilgisi eklenecek.*/
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],


});

userSchema.pre('save', async function (next) {
//şifrenin kayıt öncesinde hashlenmesi için yazılan modül

    /*this keywordünü kullanarak userschema nesnesine eriştik*/
    const user = this;
    /*şifrenin ilk defa yaratılıp yaratılmadığını güncellenip güncellenmediğini isModified ile kontrol ediyoruz.*/
    if (user.isModified('password')) {
        /*ardından user nesnesinin password property sine erişip bcrypt modülü ile içerisine verdiğimiz user.password parametresini 8 kere hashliyoruz*/
        user.password = await bcrypt.hash(user.password, 8);
    }
    /*bir sonraki metoda geçiş yani kayıt işlemine geçiş için kullanılan next metodu*/
    next();
});

userSchema.methods.generateAuthToken = async function () {
    /*kullanıcıya random bir token üretilerek eklenecek olan metot.*/

    /*this keywordünü kullanarak userschema nesnesine eriştik*/
    const user = this;
    /*veritabanında _id değişkeninde sorgu yaparak env dosyasındaki key bilgisiyle token üreten metot.*/
    const token = jwt.sign({_id: user._id}, process.env.JWT_KEY);

    /*concat() metodu eklendigi dizi ile parametre olarak aldığı dizi(leri) birleştirerek yeni bir dizi döndürür.*/
    /*user nesnesine concat metot ile token eklediğimiz metot*/
    user.tokens = user.tokens.concat({token});

    /*token kullanıcıya mongodb veritabanında eklenir.*/
    await user.save();
    
    /*oluşturulan token geri dönderilir.*/
    return token;
};

userSchema.statics.findByCredentials=async (email,password)=>{

    /*Veritabanında findOne metotuyla parametre olarak gelen email verisiyle arama yaptırıyoruz*/
    const user = await User.findOne({email});
    /*eğer kullanıcı bulamazsa hata atacak*/
    if (!user){
        throw new Error({error:'Invalid login credentials'});
    }
    /*bcrypt modülü ile hash lenen şifre compare metodu ile hash den çözülerek kontrol ediliyor*/
    const isPasswordMatch = await bcrypt.compare(password,user.password);
    /*eğer false değer dönerse yani eşleşmezse kullanıcıya hata fırlatılıyor*/
    if (!isPasswordMatch){
        throw new Error({error:'Invalid Password'});
    }
    /*son olarak kullanıcı nesnesi geri dönderiliyor*/
    return user;
};

const User = mongoose.model("User",userSchema);
/*User nesnesini router içerisinde kullanabilmek için export ediyorum.*/
module.exports = User;