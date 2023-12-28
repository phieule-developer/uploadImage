let express = require('express');
let app = express();
let multer = require('multer');
let bodyParser = require('body-parser');
let cors = require('cors');
const fs = require('fs');

app.use(cors());
app.use(bodyParser.json({limit: '1024mb'}));
app.use(bodyParser.urlencoded({limit: '1024mb', extended: true}));


var storage = multer.diskStorage({

  
  destination: function (req, file, cb) {

    const uploadFolder = 'uploads/';

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder);
    }

    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname.replaceAll(" ","")}`)
  }
});
var maxSize = 1000 * 1024 * 1024 ;
var upload = multer({
  storage: storage,
  limits: { fileSize: maxSize }
})
app.use(express.static(__dirname + "/uploads"));

app.get('/uploads/:id', (req, res) => {
  try {
    res.sendFile(__dirname + "/uploads/" + req.params.id);
  } catch (error) {
    return res.send({
      success: false
    });
  }
});

app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.send({
        success: false,
        url:null,
      });

    } else {

      let host = req.headers['origin']?.split(":")[0] == 'http' ? req.headers.host : `https://${req.headers['host']}/file`;

      let url = `${host}/uploads/${req.file.filename}`;
      return res.send({
        success: true,
        url,
      })
    }
  } catch (error) {
    return res.send({
      success: false,
      url:null,
    });
  }
});

app.listen(4444, () => {
  console.log("Server is running at port 4444");
})
