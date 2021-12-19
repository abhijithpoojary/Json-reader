const express = require("express")
const path = require("path")
const multer = require("multer")
const app = express()
const fs = require("fs");
	
app.use(express.static("public"));

// View Engine Setup
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
	
// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it
	
var storage = multer.diskStorage({
	destination: function (req, file, cb) {

		// Uploads is the Upload_folder_name
		cb(null, "uploads")
	},
	filename: function (req, file, cb) {
	cb(null, file.fieldname + ".json")
	}
})
	
// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 100 * 1000 * 1000;
	
var upload = multer({
	storage: storage,
	limits: { fileSize: maxSize },
	fileFilter: function (req, file, cb){
	
		// Set the filetypes, it is optional
		var filetypes = /json/;
		var mimetype = filetypes.test(file.mimetype);

		var extname = filetypes.test(path.extname(
					file.originalname).toLowerCase());
		
		if (mimetype && extname) {
			return cb(null, true);
		}
	
		cb("Error: File upload only supports the "
				+ "following filetypes - " + filetypes);
	}

// zipfile is the name of file attribute
}).single("zipFile");	

/*app.get("/",function(req,res){
	res.render("Signup");
})*/
	
app.post("/uploadfile",function (req, res, next) {
		
	// Error MiddleWare for multer file upload, so if any
	// error occurs, the file would not be uploaded!
	upload(req, res, function(err) {

		if(err) {
			res.send(err)
		}
		else {

			//res.sendFile(__dirname+"/result.html")

			// Read json file
			fs.readFile(__dirname+"/uploads/zipFile.json", function(err, data) {
	
			// Check for errors
			if (err) throw err;

			// Converting to JSON Object
			const msg = JSON.parse(data);
	
			console.log(msg)
			res.send(JSON.stringify(msg));
			//res.send("<html><b>NAME: </b>"+msg.firstName+" "+msg.lastName+"</html>")

		});
		}
	})
})

app.get("/",function(req,res){
  res.sendFile(__dirname +"/index.html")
})


app.listen(process.env.PORT || 3000, function (){
  console.log("server on 3000 port");
});