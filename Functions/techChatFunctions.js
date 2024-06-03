const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer  = require('nodemailer');
// const generateToken = require('../');

const CreateCookiesFunc =  (req,res,lastName,firstName)=>{

    var username  = lastName + " " + firstName;

// Make sure you add secure:true , after deployment. 
res.cookie('username',username,{maxAge: 1000 * 60 * 60 * 24, httpOnly: true}); // Cookies will expire after 24 hours.
// HttpOnly : we cannot get the cookies from the web using JS.

// If you sign up, you can see the prospective Students
res.cookie('accessProspectiveStudents',true,{maxAge: 1000 * 60 * 60 * 24, httpOnly : true });
}


const checkPasswordAndEmail = (techChatModel,TechChatModel,res,req,values)=>{

    if(values.password == values.confirmPassword){

        //   if email exists in the database, then throw an error. 
        TechChatModel.find().sort({createdAt:-1})
        .then((results)=>{
        var match = false;
 
        results.forEach((result)=>{

        if(values.email  == result.email || values.lastName == result.lastName){
          
           match = true; 
            // Throw an error, a user already exists.
            return "A user already exists because emails are the same";
          }
        
        });

        if(match == false) {
        // If there is no match with the email address, they can sign up.
        
        // save the data to the database.
        techChatModel.save()  
        .then((result)=>{
            
            // create the cookies here.
            CreateCookiesFunc(req,res,values.lastName,values.firstName);
          
          //   create JWT token and store it in a cookies
          var token = createToken(result.id);

          res.cookie('jwt',token,{httpOnly:true, maxAge:maxAge * 1000});
            res.redirect('/');

            
        })
        .catch((err)=>{
          console.log(err);
        })
        
                 
        }
        })
        .catch((err)=>{
           console.log(err);  // display error if there is one.
        });
        
        } else {
        //   throw an error of passwords are not the same.
        return "Passwords and confirmPassword are not the same";
        }
    


}




var  getValuesFromRequestBody = (requestBody) => {
    var values = {
        firstName: requestBody.firstName,
        lastName: requestBody.lastName,
        email: requestBody.email,
        password: requestBody.password,
        confirmPassword: requestBody.confirmPassword,
        phone: requestBody.phone,
        highSchool : requestBody.highSchool,
        checkbox : requestBody.checkbox
    };

    return values;
}

const maxAge = 3 * 24 * 60 * 60; // 3 days

const createToken = (id)=>{
    
    // Payload and header and the secret are going to be hashed to form a signature for verification.
    // headers are automatically applied by the jwt package.
    var secret = 'techChat';
    return jwt.sign({id},'techChat',{
        expiresIn: maxAge // This is in seconds
    });

}



var checkLoginDetails = async function(TechChatModel,requestBody,res){


   const email = requestBody.email;
   const password = requestBody.password;

    const user = await TechChatModel.findOne({email});

    if(user){
    //  Check hashed password
   const auth = await bcrypt.compare(password,user.password); // comparing the hashed requestBody.password with the one in the database

//    if true, password is matched.
  if(auth){

      // We are also creating the cookies in the login page.
      var token = createToken(user.id);

      res.cookie('jwt',token,{httpOnly:true, maxAge:maxAge * 1000});
    return res.redirect('/'); // Exiting the loop while also sending the response to avoid finding a match because I'm using OR

    //  we need to return so we exit out of this function, else another response will have be sent if we reach 
//  the else function
   
  }else{

//   if auth is false, we send back an error message
renderLoginPageWithError(res);
  } 

    }else {
      renderLoginPageWithError(res);
     
    }         
}

const renderLoginPageWithError = (res)=>{
  error =  true;           
  return res.render('login',{title:'Login',error}); 

}     



const sendEmail = async (userEmail,id,token)=>{


  // Create a transporter - responsible for sending the message
  let transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'tech.chat@outlook.com', // your Outlook email address
      pass: 'Nana@techchat' // your Outlook email password
    },
    tls: {
      ciphers: 'SSLv3'
    }
  });

  let mailOptions = {
    from: 'tech.chat@outlook.com',
    to: userEmail,
    subject: 'Password Reset from TechChat',
    text : `http://localhost:3000/createPassword/${id}/${token}` 
  };

  try {
    let info =  await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
  } catch (error) {
    console.log(error);
  }
};



const generateToken = ()=>{
    return Math.random().toString(36).substr(2, 10);

}


module.exports = {
    CreateCookiesFunc,
    checkPasswordAndEmail,
    getValuesFromRequestBody,
    checkLoginDetails, createToken,
    sendEmail,
    generateToken,

}