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
      return res.send({
        success: true,
        url: `https://${req.headers.host.split(":")[0]}/file/uploads/${req.file.filename}`,
      })
    }
  } catch (error) {
    console.log(error);
    return res.send({
      success: false,
      url:null,
    });
  }

});

app.listen(4444, () => {
  console.log("Server is running at port 4444");
})
