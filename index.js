const express = require('express');
const app = new express();
const { config, engine } = require('express-edge');
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const fileUpload=require("express-fileupload")
const path = require('path');
const expressSession=require("express-session");
const connectMongo=require("connect-mongo");
const connectFlash=require("connect-flash");
const edge=require("edge.js");



const Post = require('./database/models/Post');
const storePost=require("./middleware/storePost");
const createPostController = require('./controllers/createPost')
const homePageController = require('./controllers/homePage')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const createUserController = require("./controllers/createUser");
const storeUserController = require('./controllers/storeUser');
const loginController = require("./controllers/login");
const loginUserController = require('./controllers/loginUser');
const auth=require('./middleware/auth');
const redirectIfAuthenticated=require('./middleware/redirectIfAuthenticated');
const logoutController=require('./controllers/logout');

app.use(express.static('public'));
config({ cache: process.env.NODE_ENV === 'production' });
app.use(engine);
app.use(fileUpload());
app.use(connectFlash());


const mongoStore = connectMongo(expressSession);

app.use(expressSession({
    secret: 'secret',
    store: new mongoStore({
        mongooseConnection: mongoose.connection
    })
}));


app.set('views',__dirname+'/views');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/posts/store', storePost);
app.use('*', (req, res, next) => {
    edge.global('auth', req.session.userId)
    next()
});

mongoose.connect('mongodb+srv://admin:admin@cluster0.kt47e.mongodb.net/node-blog', { useNewUrlParser: true })
    .then(() => 'You are now connected to Mongo!')
    .catch(err => console.error('Something went wrong', err))

// app.get('/', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'pages/index.html'));
// });
// app.get('/', async (req, res) => {
//     const posts = await Post.find({})
//     res.render('index', {
//         posts
//     })
// });

// app.get('/posts/new',(req,res)=>{
//     res.render('create');
// });

// app.get('/post/:id', async (req, res) => {
//     const post = await Post.findById(req.params.id)
//     res.render('post', {
//         post
//     });
// });


//--------static pages-------------------------------------


app.get('/about.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/about.html'));
});
app.get('/post.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/post.html'));
});
app.get('/contact.html', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'pages/contact.html'));
});





//-------------------post --------------------


// app.post("/posts/store", (req, res) => {
//     const {
//         image
//     } = req.files

//     image.mv(path.resolve(__dirname, 'public/posts', image.name), (error) => {
//         Post.create({
//             ...req.body,
//             image: `/posts/${image.name}`
//         }, (error, post) => {
//             res.redirect("/");
//         });
//     });
// });

app.get("/", homePageController);
app.get("/post/:id", getPostController);
app.get("/posts/new", auth,createPostController);
app.post("/posts/store", auth,storePost,storePostController);
app.get("/auth/logout",  logoutController);
app.get('/auth/login',redirectIfAuthenticated, loginController);
app.post('/users/login',redirectIfAuthenticated ,loginUserController);
app.get("/auth/register", redirectIfAuthenticated,createUserController);
app.post("/users/register", redirectIfAuthenticated,storeUserController);


let port = process.env.PORT;
if (port == null || port == "") {
  port = 4000;
}



app.listen(port, () => {
    console.log('App has started');
}); 
 
 
 
