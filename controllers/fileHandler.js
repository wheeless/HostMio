var express = require('express');
var path = require('path');
const fileUpload = require('express-fileupload');
const uuid = require('uuid');
const fs = require('fs');
const UploadedFiles = require('../models/uploadedFiles');

exports.downloadFileController = async = (req, res) => {
  try {
    fileName = req.params.fileName;

    // if (fileName.includes('..')) {
    //   res.status(403).send('Forbidden');
    // }
    // if (fileName.includes('/')) {
    //   fileName = fileName.split('/').pop();
    // }
    // if (fileName.includes('\\')) {
    //   fileName = fileName.split('\\').pop();
    // }
    // if (fileName.includes('%')) {
    //   fileName = fileName.split('%').pop();
    // }
    // if (fileName.includes(' ')) {
    //   fileName = fileName.split(' ').shift();
    // }
    // if (fileName.includes('(')) {
    //   fileName = fileName.split('(').shift();
    // }
    // if (fileName.includes(')')) {
    //   fileName = fileName.split(')').shift();
    // }
    // if (fileName.includes('[')) {
    //   fileName = fileName.split('[').shift();
    // }
    // if (fileName.includes(']')) {
    //   fileName = fileName.split(']').shift();
    // }
    // if (fileName.includes('{')) {
    //   fileName = fileName.split('{').shift();
    // }
    // if (fileName.includes('}')) {
    //   fileName = fileName.split('}').shift();
    // }
    // if (fileName.includes('|')) {
    //   fileName = fileName.split('|').shift();
    // }
    // if (fileName.includes('<')) {
    //   fileName = fileName.split('<').shift();
    // }
    // if (fileName.includes('>')) {
    //   fileName = fileName.split('>').shift();
    // }
    // if (fileName.includes('?')) {
    //   fileName = fileName.split('?').shift();
    // }
    // if (fileName.includes('!')) {
    //   fileName = fileName.split('!').shift();
    // }
    // if (fileName.includes('*')) {
    //   fileName = fileName.split('*').shift();
    // }
    // if (fileName.includes('+')) {
    //   fileName = fileName.split('+').shift();
    // }
    // if (fileName.includes('=')) {
    //   fileName = fileName.split('=').shift();
    // }

    const fileCheck = './public/downloads/' + fileName;
    //Async method
    fs.access(fileCheck, fs.F_OK, (err) => {
      if (err) {
        console.error(err);
        res.send('File not found');
      } else {
        res.download(
          path.join(__dirname, '../public/downloads', `${fileName}`)
        );
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
};

exports.showDownloads = async (req, res) => {
  try {
    const fileCheck = './public/downloads/';
    const baseUrl = process.env.BASE_URL + 'api/files/downloads/';
    //Async method
    fs.readdir(fileCheck, function (err, files) {
      if (err) {
        res.status(500).send({
          message: 'Unable to scan files!',
        });
      }
      let fileInfos = [];
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: baseUrl + file,
        });
      });
      res.status(200).send(fileInfos);
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
};

exports.uploadWithShortenedUrl = async (req, res) => {
  try {
    let avatar = req.files.avatar;
    const newFileName = uuid.v4() + '-' + avatar.name;
    const { downloadable, fileName, size } = req.body;
    const fileUploader = new UploadedFilesSchema({
      fileName,
      size,
      downloadable,
      uploadedUrl,
    });

    avatar.mv(`./public/uploads/${newFileName}`, function (err) {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send({
        message: 'File uploaded!',
        fileName: newFileName,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json('Server Error');
  }
};

exports.upload = async = (req, res) => {
  try {
    if (!req.files) {
      res.send({
        status: false,
        message: 'No file uploaded',
      });
    } else {
      //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
      let avatar = req.files.avatar;
      const thisBaseUrl = process.env.BASE_URL + 'api/files/downloads/';
      const newFileName = uuid.v4() + '-' + avatar.name;
      //Use the mv() method to place the file in upload directory (i.e. "uploads")
      if (req.body.downloadable === 'true') {
        avatar.mv(`./public/downloads/` + newFileName);
        var downloadUrl = process.env.BASE_URL + newFileName;
      } else {
        avatar.mv('./private/uploads/' + newFileName);
        var downloadUrl = 'File not downloadable';
      }
      //send response

      res.send({
        status: true,
        message: 'File is uploaded',
        downloadable: req.body.downloadable,
        data: {
          name: newFileName,
          mimetype: avatar.mimetype,
          size: avatar.size / 1000 + ' bytes',
          url: thisBaseUrl + downloadUrl,
        },
      });

      //   res.json(response);
    }
  } catch (err) {
    res.status(500).send(err);
  }
};