var express =   require("express");
var multer  =   require('multer');
var app         =   express();
var fs = require("fs");
var  path = require("path");
// Add headers
// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, OPTIONS');
    
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With,content-type,X-Custom-Header,accept');
    
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/listUsers', function (req, res) {
   fs.readFile( __dirname + "/" + "users.json", 'utf8', function (err, data) {
       console.log( data );
       res.end( data );
   });
});
app.get('/listFiles', function (req, res) {
	var p = "./src/client/uploads"
	var results = []
	var filesSorted = [];
	var arrayStr;
	var filesSorted1 = {
     credentials: []
	};
fs.readdir(p, function (err, files) {
	  
    if (err) {
        throw err;
    }
	console.log(files);
	files.map(function (file) {
		var fileObj = p + '/'+file;
      stats = fs.lstatSync(fileObj);
		filesSorted.push({
            "filename" : file,
            "size" : stats['size'],
            "creation" : stats['birthtime']
        });
		filesSorted1.credentials.push({
            "filename" : file,
            "size" : stats['size'],
            "creation" : stats['birthtime']
        });
        		results.push(file)
    });
	console.log( filesSorted);
		console.log( JSON.stringify(filesSorted1));

	res.json(filesSorted);
	});
});
var storage =   multer.diskStorage({
   destination: function (req, file, callback) {
     callback(null, './src/client/uploads');
   },
   filename: function (req, file, callback) {
     callback(null, file.originalname);
   }
});
var upload = multer({ storage : storage}).single('userPhoto');

 app.get('/',function(req,res){
       res.sendFile(__dirname + "/index.html");
});

 app.post('/api/photo',function(req,res){
	 upload(req,res,function(err) {
	     if(err) {
			 console.log(err);
             return res.end("Error uploading file.");
         }
	    res.end("File is uploaded");
     });
});
app.post('/upload', function(req, res){
	 console.log(res);
	 req.busboy.on("file", function(fieldName, file){
		console.log(fieldName, file);
		res.end('end the upload');
	});	
	req.pipe(req.busboy);
});
app.get('/download', function(req, res){
	console.log(req);
	console.log(res);
  var file = __dirname + '/uploads/chrome.dll';
  res.download(file); // Set disposition and send it.
});
app.delete('/deleteFile/uploads/:id',  function(req, res) {
  fs.unlink("./src/client/uploads/"+req.params.id, function(err) {
	  if (err){
         throw err;
	  }else{
		  res.send ({
        status: "200",
        responseType: "string",
        response: "success"
      });     
	  }		  
      
    });
});
 app.listen(3000,function(){
     console.log("Working on port 3000");
   });
