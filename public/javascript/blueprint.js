const controller = require("../../controllers/blueprint");

let blueprints = [];

async function addABlueprint(element) {
  console.log(element);
  console.log(element.id);
  console.log(pickedElement.value);

  let pickedElement = document.getElementById(element.id);
  let blueprint = await controller.getBlueprintssById(element.id);

  let tempBP = {
    type: element.id,
    ref: "Blueprint",
    bluePrintAmount: pickedElement.value,
  };

  console.log(tempBP);

  blueprints.push(tempBP);
}

function snupEnComponent() {
  console.log("Der trykkes!");
  alert("It's working");
  // let dropdown = document.getElementById("compDropDown")
  // let value = dropdown.value
  // console.log(value);
}
