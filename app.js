
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate")
const Superhero = require("./models/superhero");
const methodOverride = require("method-override");
const multer = require("multer")
const {storage} = require("./cloudinary")
const upload = multer({storage})
const {cloudinary} = require("./cloudinary")

const dbUrl =
  "mongodb+srv://master:kusxzqpn5M4Uowhj@cluster0.ae3k2.mongodb.net/superhero?retryWrites=true&w=majority";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.engine("ejs", ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/superheroes", async (req, res) => {
  const superheroes = await Superhero.find({});
  res.render("superheroes/index", { superheroes });
});

app.get("/superheroes/new", (req, res) => {
  res.render("superheroes/new");
});

app.post("/superheroes", upload.array("images"), async (req, res) => {
  
  const superhero = new Superhero(req.body.superhero);
  superhero.images = req.files.map(file=>({url:file.path, filename: file.filename}))
  await superhero.save();
  res.redirect(`/superheroes/${superhero._id}`);
});

app.get("/superheroes/:id", async (req, res) => {
  const superhero = await Superhero.findById(req.params.id);
  res.render("superheroes/show", { superhero });
});

app.get("/superheroes/:id/edit", async (req, res) => {
  const superhero = await Superhero.findById(req.params.id);
  res.render("superheroes/edit", { superhero });
});

app.put("/superheroes/:id", upload.array("images"), async (req, res) => {
  const { id } = req.params;
  const superhero = await Superhero.findByIdAndUpdate(id, {
    ...req.body.superhero,
  });
  const imgs = req.files.map(file=>({url:file.path, filename: file.filename}))
  superhero.images.push(...imgs)

  if(req.body.deleteImages){ //delete images
     for(let filename of req.body.deleteImages){
       await cloudinary.uploader.destroy(filename)
     }
     await superhero.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
  }

  await superhero.save()
  res.redirect(`/superheroes/${superhero._id}`);
});

app.delete("/superheroes/:id", async (req, res) => {
  const { id } = req.params;
  await Superhero.findByIdAndDelete(id)
  res.redirect("/superheroes")
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Port  ${port}`)
});
