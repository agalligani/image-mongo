require('dotenv').config()
require('express-async-errors')
const express = require('express')
const app = express()
const path = require('path')
const fs = require('fs')
// const { logger, logEvents } = require('./middleware/logger')
// const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const bodyParser = require("body-parser")
const formidable = require("formidable")

const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)

connectDB()

// app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)


const isFileValid = (file) => {
    const type = file.mimetype.split("/").pop();
    const validTypes = ["jpg", "jpeg", "png", "pdf"];
    if (validTypes.indexOf(type) === -1) {
      return false;
    }
    return true;
  };

app.post("/api/uploadFile", (req, res) => {
    console.log("ok")
    const uploadFolder = path.join(__dirname, "public", "files");
    const form = new formidable.IncomingForm();
    form.multiples = true;
    form.maxFileSize = 50 * 1024 * 1024; // 5MB
    form.uploadDir = uploadFolder;
// Parsing
form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log("Error parsing the files");
      return res.status(400).json({
        status: "Fail",
        message: "There was an error parsing the files",
        error: err,
      });
    }
    // Check if multiple files or a single file
if (!files.myFile.length) {
    //Single file

    console.log(files)
  
    const file = files.myFile;
  
    // checks if the file is valid
    const isValid = isFileValid(file);
  
    // creates a valid name by removing spaces
    const fileName = encodeURIComponent(file.newFilename.replace(/\s/g, "-"));
  
    if (!isValid) {
      // throes error if file isn't valid
      return res.status(400).json({
        status: "Fail",
        message: "The file type is not a valid type",
      });
    }
    try {
      // renames the file in the directory
      console.log( [uploadFolder, file.originalFilename].join)

      fs.renameSync(file.filepath, `${uploadFolder}/${file.originalFilename}`)
    } catch (error) {
      console.log(error);
    }
  
    try {
      // stores the fileName in the database
    //   const newFile = await File.create({
    //     name: `files/${fileName}`,
    //   });
      return res.status(200).json({
        status: "success",
        message: "File created successfully!!",
      });
    } catch (error) {
      res.json({
        error,
      });
    }
  } else {
    // Multiple files
  }
  })

  
  });

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, 'views'))
app.use('/', express.static(path.join(__dirname, 'public')))
// app.use('/', require('./routes/root'))
app.use('/', (req,res)=>{
    res.status(200).render('index')
})  



// app.use('/auth', require('./routes/authRoutes'))
// app.use('/users', require('./routes/userRoutes'))
// app.use('/notes', require('./routes/noteRoutes'))

app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 Not Found' })
    } else {
        res.type('txt').send('404 Not Found')
    }
})

// app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})

var gridFSBucket = new mongoose.mongo.GridFSBucket(mongoose.connection, {
    bucketName: 'images'
 });

mongoose.connection.on('error', err => {
    console.log(err)
    // logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})