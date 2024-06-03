const http = require('http');
const fs = require('fs');

const server = http.createServer((req,res)=>{
    // console.log('request made');
    // console.log(req.url, req.method);


 res.setHeader('Content-Type','text/html');
  
let path = './views/';

  switch(req.url){
  

    case '/' : 
    path += 'index.html';
    fs.readFile(path,(err,data)=>{
        if(err){
           console.log(err); 
           res.end();
        }else {
            res.write(data);
            res.end();
        }
    });
    
    break;

    case '/404' : 
    path += '404.html';
    fs.readFile(path,(err,data)=>{
        if(err){
           console.log(err); 
           res.end();
        }else {
            res.write(data);
            res.end();
        }
    });
      break;

    case  '/about' : 
    path += 'about.html';
    fs.readFile(path,(err,data)=>{
        if(err){
           console.log(err); 
           res.end();
        }else {
            res.write(data);
            res.end();
        }
    });
    break;

    default :     
    path += '404.html';
    fs.readFile(path,(err,data)=>{
        if(err){
           console.log(err); 
           res.end();
        }else {
            res.write(data);
            res.end();
        }
    });
    break;



  }


 fs.readFile('./views/index.html',(err, data)=>{
   if(err){
    console.log(err);
    res.end();
   }else {
    res.write(data);
    res.end();
   }


});

})

server.listen(3000,'localhost',()=>{
    console.log("Listening on port 3000");
});