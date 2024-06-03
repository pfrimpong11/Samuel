const express  = require('express');
const mongoose = require('mongoose');
const techChatControllers = require('./Controllers/techControllers'); // requiring the controllers 
const cookieParser  = require('cookie-parser');
const {requireAuth}  = require('./MiddleWare/authController');

// invoking express app to create an instance of it.
const app = express();


// connect to mongodb
const dbURI = 'mongodb+srv://samuel:test1234@cluster0.ghsyetl.mongodb.net/node-tuts';
mongoose.connect(dbURI)
// const dbURI = 'mongodb://localhost:27017/node-tuts';
// mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
 .then ((result)=> // listen for request so after we've connected to the database, then we can listen for request and maybe show the data on the page if it's required.
 {
console.log('connected to the database, so listen for request.')
 app.listen(3000)  //listen to request if connected to the database.
 }
).catch((err)=> console.log(err));








// Register view engine
app.set('view engine','ejs'); // express automatically finds the views folder
app.use(express.static('public'));
app.use(express.urlencoded({extended: true})); // This takes the data from the form and sends it to the request body
//we can use a method on the request body to retrieve the data.
app.use(cookieParser());

// **************** GET REQUESTS  WITH THEIR CONTROLLERS ***************

app.get('/techchat',techChatControllers.GetRequestHomeScreenController);
app.get('/login',techChatControllers.GetRequestLoginController);
app.get('/signup',techChatControllers.GetRequestSignUpController);
app.get('/resetPassword',techChatControllers.GetRequestsForgotPasswordController);
app.get('/',techChatControllers.GetRequestAlternativeHomeScreenController);  // redirect to the signup page.
app.get('/allStudents',requireAuth, techChatControllers.GetRequestAllStudentsController);
app.get('/feedback',techChatControllers.GetRequestFeedbackController);
app.get('/emailSent',techChatControllers.GetRequestEmailSentController);
app.get('/createPassword',techChatControllers.GetRequestCreatePasswordController);
app.get('/search', techChatControllers.SearchStudentsController);
app.get('/logout',techChatControllers.GetRequestLogoutController);


// ********** POST REQUESTS AND ITS CONTROLLER****************

app.post('/login',techChatControllers.PostLoginController); 


// LAST MIDDLEWARE.
app.use((req,res)=>{
    res.status(404).render('404',{title:'404'});
  
   });

