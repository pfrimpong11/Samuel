// Protecting routes
const jwt = require('jsonwebtoken');



const requireAuth = (req,res,next)=>{

// get the cookies 
const token = req.cookies.jwt;


if(token){
// if we have the token, we want to verify it.
jwt.verify(token,'techChat',(err, decodedToken)=>{

    // If there is an error with the token, we redirect to the login page
    if(err){
console.log('This is the error if token is wrong',err);
res.redirect('/');
    }else {
        console.log(decodedToken);
        next();
    }



}); // trying to create the same signature.



}else {  // If users don't have the tokens, we redirect them.
//  redirect to the home page
  res.redirect('/');
}


}



module.exports = {

    requireAuth,
}