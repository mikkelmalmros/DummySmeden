// Requires
const express = require("express");
const config = require("./config");
const mongoose = require("mongoose");
const body = require("body-parser");
const componentController = require("./controllers/component");
const blueprintController = require("./controllers/blueprint");
const blueprintRouter = require('./routes/blueprint')

// Til test - Skal slettes senere
const Blueprint = require("./models/blueprint");
const Component = require("./models/component");

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
app.set("view engine", "pug");

app.use("/static", express.static("public"));

app.use(body.json());
app.use(body.urlencoded({ extended: false }));

app.use('/blueprint', blueprintRouter)


//End points
//Finder blueprints og components fra DB og viser storage.pug
app.get("/", async (req, res) => {
  const components = await componentController.getComponents();
  const blueprints = await blueprintController.getBlueprints();

  res.render("storage", { components: components, blueprints: blueprints });
});

//Opretter en komponent
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

//Sletter en komponent fuldstændigt fra DB
app.post("/deleteComponent", async (req, res) => {
  const componentID = req.body.dropdownDelete;
  await componentController.deleteComponent(componentID);
  res.redirect("/");
});

//Start server
app.listen(port, () => {
  console.log("Serveren kører");
});
