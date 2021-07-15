const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const sequelize = require('./util/database');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

// User-Product association
//User has many products
User.hasMany(Product, {constraints: true, onDelete: 'CASCADE '});

//User-Cart association
// User has only one Cart
User.hasOne(Cart);

// Cart-Product association
//many-to-many relation between Cart-Product through CartItem
Cart.belongsToMany(Product, {through: CartItem});
Product.belongsToMany(Cart, {through: CartItem});

//force: true for development only
sequelize.sync({force: true}).then(result => {
    //do smthin
    app.listen(3000);
})
.catch(err => {
    console.log(err);
});


