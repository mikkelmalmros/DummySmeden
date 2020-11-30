// Requires
const express = require("express");
const config = require("./config");
const mongoose = require("mongoose");
const body = require("body-parser");

const componentController = require("./controllers/component");
const blueprintController = require("./controllers/blueprint");
const productController = require("./controllers/product")
const userController = require('./controllers/user')


const bcrypt = require('bcrypt')

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
app.use(session({secret: 'DummysmedensMorhundeFælderAPS', saveUninitialized:false, resave:true}))
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




//Tjek af at vi ikke får tomme strenge ind (eller strenge bestående af spaces)
const valider = /[a-zA-Z0-9]+/;

//End points
//Finder blueprints og components fra DB og viser storage.pug
app.get("/", async (req, res) => {
  const components = await componentController.getComponents();
  const blueprints = await blueprintController.getBlueprints();
  const products = await productController.getAllProducts();

  res.render("storage", { components: components, blueprints: blueprints, products: products });
});

app.get('/login', (req, res) => {
  res.render('login')
})


//userController.createUser("admin", "adminadmin")


app.get('/users', async (req, res) => {
  if(req.session.isLoggedIn) {
    const users = await userController.getUsers() 
  res.json(users)
  } else {
    res.redirect('/login')
  }
  
})



app.post('/login', async (req, res) => {
  console.log(req.body.username);
  const user = await userController.getUsersByName(req.body.username)
  console.log("User:" + user);
    if(user == null) {
        return res.status(400).json({Error: "Cannot find user"})
    }
    try {
        if(await bcrypt.compare(req.body.password, user.password)) {
            console.log(user.username + " is logged in")
            req.session.isLoggedIn = true
            res.send('Sucess')
        } else {
            res.send('Not allowed')
        }
    } catch (error) {
        console.log('Error: ' + error);
        res.status(500).json({Error: error})
    }
})

app.get('/logout', (req, res) => {
  if(req.session.isLoggedIn) {
    req.session.isLoggedIn = false
    res.redirect('/login')
  } else {
    res.redirect('/login')
  }
})

// DENNE METODE ER FLYTTET TIL /ROUTER/KOMPONENT
//Opretter en komponent
/*
app.post("/createComponent", async (req, res) => {
  const name = req.body.name2;
  const amount = req.body.amount2;
  const storageMin = req.body.storageMin2;

  if (valider.test(name) && valider.test(amount) && valider.test(storageMin)) {
    await componentController.createComponent(name, amount, storageMin);
  } else {
    //Vis pæn besked til brugeren
    console.log("Forkerte værdier i /createComponent");
  }

  res.redirect("/");
});
*/

// DENNE METODE ER FLYTTET TIL /ROUTER/KOMPONENT

/*
//Opdaterer attributter i komponent
app.post("/updateComponent", async (req, res) => {
  const componentID = req.body.dropdownComponents;
  const component = await componentController.getComponent(componentID);
  const amount = req.body.updateamount;
  const name = req.body.updatename;
  const minimum = req.body.updatemin;

  if (valider.test(amount)) {
    await componentController.updateAmount(component, amount);
  } else {
    //Vis pæn besked til brugeren
    console.log("Forkerte værdier i /updateComponent (amount)");
  }

  if (valider.test(name)) {
    await componentController.updateName(component, name);
  } else {
    //Vis pæn besked til brugeren
    console.log("Forkerte værdier i /updateComponent (name)");
  }

  if (valider.test(minimum)) {
    await componentController.updateMininum(component, minimum);
  } else {
    //Vis pæn besked til brugeren
    console.log("Forkerte værdier i /updateComponent (minimum)");
  }

  res.redirect("/");
});
*/

// DENNE METODE ER FLYTTET TIL /ROUTER/KOMPONENT


//
/*
//Sletter en komponent fuldstændigt fra DB
app.post("/deleteComponent", async (req, res) => {
  const componentID = req.body.dropdownDelete;
  await componentController.deleteComponent(componentID);
  res.redirect("/");
});
*/

//Start server
app.listen(port, () => {
  console.log("Serveren kører");
});
