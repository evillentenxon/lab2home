const express= require('express');
const multer= require('multer');
const nodemailer= require('nodemailer');
const path= require('path');
const fs = require('fs');

const port=8080;
const app= express();
const indexHTML= path.join(__dirname, '..', 'public','index.html');
const transferHTML= path.join(__dirname, '..', 'public','transfer.html');

app.use(express.static('../public'));
app.use(express.urlencoded({ extended: true }));

// Set up Multer for handling file uploads (attachments)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../uploads');
    },
    filename: function (req, file, cb) {
      cb(null, 'GhodeGang' + Date.now() + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

app.get('/',(req,res)=>{
    res.sendFile(indexHTML);
})

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'evillentenxon13@gmail.com',
      pass: 'xpjz cfih gmmx uchq'
    }
  });
  
  app.post("/transfer", upload.single('attachment'), (req, res) => {
    const { email, subject, message } = req.body;
    const attachment = req.file;
  
    var mailOptions = {
      from: 'evillentenxon13@gmail.com',
      to: email,
      subject: subject,
      text: message,
      attachments: attachment
        ? [
          {
            filename: path.basename(attachment.path), // Get the filename without the path
            path: attachment.path,
          },
        ]
        : [],
    };
    
    
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.send(error);
      } else {
        res.sendFile(transferHTML);
      }
  
      // now deleting the uploaded file after sending
      if (attachment) {
        fs.unlink(attachment.path, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log('File deleted:', attachment.path);
          }
        })}
    })
  
  });
  
  app.listen(port, () => {
    console.log(`App is running on port ${port}`)
  })