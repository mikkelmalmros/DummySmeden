// Requires
const express = require("express");
const config = require("./config");
const mongoose = require("mongoose");
const body = require("body-parser");
const componentController = require("./controllers/component");
const blueprintController = require("./controllers/blueprint");
const productController = require("./controllers/product")
const userController = require('./controllers/user')
const bcrypt = require('bcryptjs')
const session = require('express-session')

//MongoDB setup
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDBHost, {
  useNewUrlParser: true,
  useCreateIndex: true,
  autoIndex: true,
  useUnifiedTopology: true,
});

// Attributes
let port = process.env.PORT || 8080;

const app = express();
app.use(session({ secret: 'DummysmedensMorhundeFælderAPS', saveUninitialized: false, resave: true }))
app.set("view engine", "pug");

app.use("/static", express.static("public"));

app.use(body.json());
app.use(body.urlencoded({ extended: false }));

const blueprintRouter = require('./routes/blueprint')
app.use('/blueprint', blueprintRouter)
const componentRouter = require('./routes/component')
app.use('/component', componentRouter)
const productRouter = require('./routes/product')
app.use('/product', productRouter)
const apiRouter = require('./routes/api')
app.use('/api', apiRouter)

//End points
//Finder blueprints og components fra DB og viser storage.pug
app.get("/", async (req, res) => {
  //OBS have to be changed!
  req.session.isLoggedIn = true

  if (req.session.isLoggedIn) {
    const components = await componentController.getComponents();
    const blueprints = await blueprintController.getBlueprints();
    const products = await productController.getAllProducts();
    res.render("storage", { components: components, blueprints: blueprints, products: products });
  } else {
    res.redirect('/login')
  }
});

app.get('/login', (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect('/')
  } else {
    res.render('login')
  }
})

// userController.createUser("admin", "adminadmin")

app.get('/users', async (req, res) => {
  if (req.session.isLoggedIn) {
    const users = await userController.getUsers()
    res.json(users)
  } else {
    res.redirect('/login')
  }
})

app.post('/login', async (req, res) => {
  const user = await userController.getUsersByName(req.body.username)
  if (user == null) {
    return res.status(400).json({ Error: "Cannot find user" })
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      req.session.isLoggedIn = true
      res.redirect('/')
    } else {
      res.send('Not allowed')
    }
  } catch (error) {
    res.status(500).json({ Error: error })
  }
})

app.get('/logout', (req, res) => {
  if (req.session.isLoggedIn) {
    req.session.isLoggedIn = false
    res.redirect('/login')
  } else {
    res.redirect('/login')
  }
})

//Start server
app.listen(port, () => {
  console.log("Serveren kører");
});
