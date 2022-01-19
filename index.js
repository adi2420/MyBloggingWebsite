const express = require('express');
const app = new express();
const { config, engine } = require('express-edge');
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const fileUpload=require("express-fileupload")
const path = require('path');



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

app.use(express.static('public'));
config({ cache: process.env.NODE_ENV === 'production' });
app.use(engine);
app.use(fileUpload());


app.set('views',__dirname+'/views');

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use('/posts/store', storePost);

mongoose.connect('mongodb://localhost:27017/node-blog', { useNewUrlParser: true })
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
app.get("/posts/new", createPostController);
app.post("/posts/store", storePostController);
app.get('/auth/login', loginController);
app.post('/users/login', loginUserController);
app.get("/auth/register", createUserController);
app.post("/users/register", storeUserController);




app.listen(4000, () => {
    console.log('App listening on port 4000')
}); 
 
 
 
