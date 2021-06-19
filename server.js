let express = require('express');
let app = express();
const os = require('os');
let multer = require('multer');
let bodyParser = require('body-parser');
let cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})
var upload = multer({ storage: storage });
app.use(express.static(__dirname+"/uploads"));
app.get('/uploads/:id',(req,res)=>{
    try {
        res.sendFile(__dirname+"/uploads/"+req.params.id);
    } catch (error) {
      return res.send({
        success: false
      });
    }
})
app.post('/api/upload', upload.single('file'), (req, res) => {
    try {
      console.log(req.headers.host);
        if (!req.file) {
            return res.send({
              success: false
            });
            
          } else {
            return res.send({
              success: true,
              link_image:`http://${req.headers.host}/uploads/${req.file.filename}`,
            })
          }
    } catch (error) {
        return res.send({
            success: false
          });
    }
    
  });
app.listen(8000,()=>{
    console.log("Server is running at port 8000");
})