const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');


// This creates a new schema object, we are creating the schema(the structure of the object)
const techChatSchema = new Schema({
 firstName : {
type : String, 
required : true,
 }, 


lastName :  {
type : String, 
required : true,
}, 
    
email: {
    type : String, 
    required : true,
    unique: true,
    lowercase:true,  
},
password : {
    type : String, 
    required : true,
    // minlength :[6, 'Minimum password length is a 6 characters']
},

phone : {
    type : Number,
    required : true,

},

highSchool :  {
    type : String, 
    required : true,
     }  
    

},

// This is an option object from Schema constructor.
{
    timestamps: true
}
);



// Mongoose hook 


//Fire a function before request body is saved to the database.
// we will get the this keyword as the request body when we don't use an arrow function
techChatSchema.pre('save',async function (next) {

// Hash password before data is saved to the database.
var mySalt = await bcrypt.genSalt(); // generate the salt for hashing
this.password = await bcrypt.hash(this.password,mySalt);
// We have updated the this.password to a new one - > hashed value.

next() // move to the next middleware
});


// techChatSchema.statics.login = async function(email,password){
// const user = await this.findOne({email}); // Finding a user. 

// // if we do have a user, compare the hashed password.
// if(user){

// }
// }


//creating the model based on the schema so we could use methods and properties from that model.

const techChatModel = mongoose.model('techChat',techChatSchema); // mongoose is going to look for the plural of techChat on the database.



module.exports = techChatModel;
