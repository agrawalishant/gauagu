var express = require('express');
var router = express.Router();
const multer = require('multer');
const moment = require('moment');
var myDate = new Date();
var date = moment(myDate).format('lll');
const {body, checkSchema, validationResult} = require('express-validator');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
//======================= file ============================

//Storage the folder functionality
var storage = multer.diskStorage({
  destination: function (req, file, cd) {
      cd(null, 'upload/images/')
  },
  filename: function (req, file, cd) {
      cd(null, date + file.originalname)
  }
})

//upload the file function
var upload = multer({
  storage: storage
}).any('');
router.post("/file", function (req, res, next) {
  console.log('de,p');
  upload(req, res, function (err) {
      if (err) {
          res.json(err)
      } else {
          var imagename = req.files;
          imagename.map(data => {
              var imageurl = "https://localhost:3030/" + date + data.originalname;
              res.json({
                  "success": true,
                  "message": 'Image uploaded',
                  "imageurl": imageurl,
                  filename: data.filename
              })
          })
      }
  })
})

const validate = validations => {
  return async (req, res, next) => {
      await Promise.all(validations.map(validation => validation.run(req)));

      const errors = validationResult(req);
      if (errors.isEmpty()) {
          return next();
      }

      res.status(400).json({
          errors: errors.array()
      });
  };
};
const registrationSchema = {
  username: {
      custom: {
          options: value => {
              return User.find({
                  username: value
              }).then(user => {
                  if (user.length > 0) {
                      return Promise.reject('Username already in use')
                  }
              })
          }
      }
  },
  gender: {
      notEmpty: true,
      errorMessage: "Gender field cannot be empty"
  },
  password: {
      isStrongPassword: {
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1
      },
      errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number",
  },
  phone: {
      notEmpty: true,
      errorMessage: "Phone number cannot be empty"
  },
  email: {
      normalizeEmail: true,
      custom: {
          options: value => {
              return User.find({
                  email: value
              }).then(user => {
                  if (user.length > 0) {
                      return Promise.reject('Email address already taken')
                  }
              })
          }
      }
  }
}

/*mailer.extend(app, {
  from: 'Gaugau <info@gaugau.com.au>',
  host: 'smtp.gmail.com', // hostname
  service: 'gmail',
  secureConnection: true, // use SSL
  port: 465, // port for secure SMTP

  transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
  auth: {
   user: 'test@gmail.com',
    pass: 'test'
  }
});*/


module.exports = router;
