const formidable = require("formidable")
require('dotenv').config()
const path = require('path')
const fs = require('fs')
const Image = require('../models/Image')

const url = process.env.DATABASE_URI
const baseUrl = "http://localhost:3500/files/"

const isFileValid = (file) => {
  const type = file.mimetype.split("/").pop()
  const validTypes = ["jpg", "jpeg", "png", "pdf"]
  if (validTypes.indexOf(type) === -1) {
    return false
  }
  return true
}

const postImages = (req, res) => {

  const uploadFolder = path.join(__dirname, "..", "public", "files")
  const form = new formidable.IncomingForm()
  form.multiples = true
  form.maxFileSize = 50 * 1024 * 1024; // 5MB
  form.uploadDir = uploadFolder
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log("Error parsing the files")
      return res.status(400).json({
        status: "Fail",
        message: "There was an error parsing the files",
        error: err,
    })
  }
  // Check if multiple files or a single file
if (!files.myFile.length) {
  const file = files.myFile

  // checks if the file is valid
  const isValid = isFileValid(file);

  // creates a valid name by removing spaces
  const fileName = encodeURIComponent(file.newFilename.replace(/\s/g, "-"));

  if (!isValid) {
    return res.status(400).json({
      status: "Fail",
      message: "The file type is not a valid type",
    });
  }
  try {
    // renames the file in the directory
    const originalFilenameURLfriendly = file.originalFilename .replace(/\s+/g, '-').toLowerCase();

    fs.renameSync(file.filepath, `${uploadFolder}/${originalFilenameURLfriendly}`)
  } catch (error) {
    console.log(error);
  }

  try {
    // stores the fileName in the database
    const newImage = await Image.create({
      name: `files/${fileName}`,
    })
    console.log(newImage)
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
}

module.exports = {
  postImages
}
