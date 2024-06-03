const TechChatModel = require('../models/techChat'); // our model in the model's folder
var error = false; // For errors in the login page
const {CreateCookiesFunc, checkLoginDetails, getValuesFromRequestBody, checkPasswordAndEmail,createToken,sendEmail} = require('../Functions/techChatFunctions');
const jwt = require('jsonwebtoken');
const techChatModel = require('../models/techChat');
const bcrypt = require('bcrypt');
const {generateToken} = require('../Functions/techChatFunctions');
// GET CONTROLLERS
const GetRequestHomeScreenController = (req,res)=>{
    res.send("<center><h3>The techChat screen</h3></center> <br> <br> <a href='/allStudents'> Prospective Students </a>"); 
}

const GetRequestLoginController = (req,res) => {
   
    error = false;
   
    res.render('login',{title:'Login',error});
  }

const GetRequestSignUpController = (req,res) => {
    res.render('create',{title: 'Sign Up',error:false});  
}

const GetRequestAlternativeHomeScreenController = (req,res)=>{
    res.render('home');
}

const GetRequestAllStudentsController =  (req,res)=>{

    // Getting the username from the cookies.
var username   = req.cookies.username;

// check if the user has the accessProspectiveStudent cookies.


    TechChatModel.find().sort({createdAt:-1})
    .then((results)=>{
       res.render('prospective',{
           results,
           username,
       });  
    })
    .catch((err)=>{
       console.log(err);  // display error if there is one.
    });
    


}

const GetRequestsForgotPasswordController = (req,res)=>{
    res.render('forgotPassword') ; 
  }


  const GetRequestFeedbackController = (req,res)=>{
    res.render('feedbackForm');
  }


  const GetRequestCreatePasswordController = async (req,res)=>{
//    get the id and the a desired token.
const { id, token } = req.params;



// search if that Id is in the database, else we redirect the user back to the forgotPassword place.

try{
    const result = await TechChatModel.findOne({_id: id});  
    res.render('createNewPassword'); // send the createNew passsword page.
     
}catch(err){
    res.redirect('/resetPassword');
    return;
}




  }




const GetRequestLogoutController = (req,res)=>{
// We change the cookies to something else 
res.cookie('jwt','',{maxAge:1});
res.redirect('/login');
}
// POST CONTROLLERS

const PostLoginController = (req,res)=>{
        // if is a signup page that is sending a post request to this endpoint
    if(req.body.form ==  'Sign Up' ){
    
  
    const techChatModel =  new TechChatModel(req.body); 
    // With the req.body, we are directly putting it in the model.  


var values = getValuesFromRequestBody(req.body);

//  Check the Password and confirm Passwords.
var getTheSavedData = checkPasswordAndEmail(techChatModel,TechChatModel,res,req,values);
 
        
    }else {

         checkLoginDetails(TechChatModel,req.body,res);


    }
    
    }

    const PostRequestsForgotPasswordController = async (req,res)=>{

const userEmail = req.body.email;
// console.log(userEmail); 
const result = await TechChatModel.findOne({email: userEmail});

if(result){
    const id = result.id;
    const token= generateToken();
    
    // call the sendEmail Function.
    sendEmail(userEmail,id,token);
    
    // After sending it, redirect the user.
    res.redirect('/login');
} else {

    res.redirect('/resetPassword')
}


    }


    // Updating the email's password , hash it and save it to the database 
    const PostRequestsCreatePasswordController = async (req,res)=>{

        console.log(req.body.email);

        const email  = req.body.email;
        const newPassword = req.body.password;
// Check if the email exists.
const user = await TechChatModel.findOne({email});
// If there is a user as such, then we take new password and hash it.
if(user){

    var mySalt = await bcrypt.genSalt(); // generate the salt for hashing
    hashedPassword = await bcrypt.hash(newPassword,mySalt);

    // update the user's password in the database.
   const result =  await TechChatModel.findOneAndUpdate(
        {email:email},
        {password:hashedPassword},
        {new:true} // saying true returns the result.
    ); 

    if(result) {
        console.log("Password was updated");
        res.redirect('/login');
    }else {
        console.log('User not found ');
    }

}



    }

    // search controller
    const SearchStudentsController = async (req, res) => {
      const query = req.query.query;
      console.log('Search query:', query); // Debugging
  
      try {
          const isNumeric = !isNaN(query); // Check if the query is numeric
          const regexQuery = new RegExp(query, 'i');
          const searchConditions = isNumeric ? 
              { phone: query } : 
              {
                  $or: [
                      { firstName: regexQuery },
                      { lastName: regexQuery },
                      { highSchool: regexQuery },
                      { email: regexQuery },
                  ]
              };
  
          const results = await TechChatModel.find(searchConditions);
          console.log('Search results:', results); // Debugging
          res.json(results); // Send JSON response
      } catch (error) {
          console.error('Error during search:', error); // Debugging
          res.status(500).send(error);
      }
  };
  
  




    module.exports = {
        GetRequestHomeScreenController,
        GetRequestLoginController,
        GetRequestSignUpController,
        GetRequestAlternativeHomeScreenController,
        GetRequestsForgotPasswordController,
        GetRequestAllStudentsController,
        GetRequestFeedbackController,
        GetRequestCreatePasswordController,
        GetRequestLogoutController,
        PostLoginController,
        PostRequestsForgotPasswordController,
        PostRequestsCreatePasswordController,
        SearchStudentsController,

    }