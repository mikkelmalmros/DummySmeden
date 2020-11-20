const ComponentAmount = require('../models/componentAmount')

exports.createComponentAmount = async function(component, amount) {
    const componentAmount = ComponentAmount({
        component:component,
        amount:amount
      });
      await componentAmount.save();
      return componentAmount
}