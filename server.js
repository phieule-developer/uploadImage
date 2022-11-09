let express = require('express');
let app = express();
// const cron = require('node-cron');
let multer = require('multer');
const fs = require('fs');
let bodyParser = require('body-parser');
let cors = require('cors');
const mime = require('mime');
let generateSafeId = require('generate-safe-id');

app.use(cors());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage });
// cron.schedule('0 3 * * *', async () => {
//   fsExtra.emptyDirSync("./uploads")

// }, { timezone: "Asia/Ho_Chi_Minh" });
app.use(express.static(__dirname + "/uploads"));
app.get('/uploads/:id', (req, res) => {
  try {
    res.sendFile(__dirname + "/uploads/" + req.params.id);
  } catch (error) {
    return res.send({
      success: false
    });
  }
})
const uploadImage = async (req, res, next) => {
  // to declare some path to store your converted image
  try {
    var matches = req.body.file.toString().match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
    response = {};
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }

    response.type = matches[1];
    response.data = Buffer.from(matches[2], 'base64');
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.extension(type);

    let fileName = `${generateSafeId()}.${extension}`;

    fs.writeFileSync("./uploads/" + fileName, imageBuffer, 'utf8');
    return res.send({
      success: true,
      link_image: `http://${req.headers.host}/uploads/${fileName}`,
    })
  } catch (e) {
    next(e);
  }
}

app.post('/upload/image', uploadImage)
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.send({
        success: false
      });

    } else {
      return res.send({
        success: true,
        link_image: `http://${req.headers.host}/uploads/${req.file.filename}`,
      })
    }
  } catch (error) {
    return res.send({
      success: false
    });
  }

});
app.post("/api/upload/multiple", upload.array('files', 5), (req, res) => {
  try {
    if (!req.files) {
      return res.send({
        success: false
      });

    } else {
      let image_list = [];
      for (const item of req.files) {
        image_list.push(`http://${req.headers.host}/uploads/${item.filename}`);
      }
      return res.send({
        success: true,
        image_list
      })
    }
  } catch (error) {
    return res.send({
      success: false
    });
  }
});
app.listen(5000, () => {
  console.log("Server is running at port 5000");
})