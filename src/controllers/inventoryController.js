// controllers/inventoryController.js
const Inventory = require("../models/Inventory");

// Create route handler
exports.createData = async (req, res) => {
  try {
    console.log(req.body);
    const {
      name,
      received_date,
      dispatched_date,
      received_quantity,
      dispatched_quantity,
    } = req.body;

    if (!name || !received_date || !received_quantity) {
      return res.status(400).json({ message: "Please fill all fields" });
    }
    const data = {
      name,
      date: {
        received_date: new Date(received_date),
        dispatched_date: dispatched_date && new Date(dispatched_date),
      },
      quantity: {
        received_quantity,
        dispatched_quantity: 0,
      },
    };
    const newInventory = await Inventory.create(data);
    res.status(201).json(newInventory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch route handler
exports.fetchData = async (req, res) => {
  try {
    const Inventories = await Inventory.find();
    res.status(200).json(Inventories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update route handler
exports.updateData = async (req, res) => {
  try {
    const { type } = req.body;

    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (type === "random") {
      var dispatchedDate = null;
      if (!item.date.dispatched_date) {
        // Function to get a random number between min and max (inclusive)
        const getRandomNumber = (min, max) =>
          Math.floor(Math.random() * (max - min + 1)) + min;

        // Function to add random days to a date
        const addRandomDays = (date, minDays, maxDays) => {
          const newDate = new Date(date);
          const daysToAdd = getRandomNumber(minDays, maxDays);
          newDate.setDate(newDate.getDate() + daysToAdd);
          return newDate;
        };

        const receivedDate = new Date(item.date.received_date);
        dispatchedDate = addRandomDays(receivedDate, 1, 8);
      }

      // Initialize dispatched_quantity to 1 if it doesn't exist, otherwise keep it within received quantity
      const receivedQuantity = item.quantity.received_quantity;
      let dispatchedQuantity = item.quantity.dispatched_quantity || 0;
      dispatchedQuantity =
        dispatchedQuantity === 0
          ? 1
          : Math.min(dispatchedQuantity + 1, receivedQuantity);

      // Update the item with new dispatched date and quantity
      const updatedItem = await Inventory.findByIdAndUpdate(
        req.params.id,
        {
          date: {
            ...item.date,
            dispatched_date: item.date.dispatched_date
              ? item.date.dispatched_date
              : dispatchedDate,
          },
          quantity: {
            ...item.quantity,
            dispatched_quantity: dispatchedQuantity,
          },
        },
        {
          new: true,
        }
      );

      return res.status(200).json(updatedItem);
    } else {
      const { received_date, received_quantity, name } = req.body;
      if (!received_date || !received_quantity || !name) {
        return res.status(400).json({ message: "Please fill all fields" });
      }

      console.log(received_date, item.date.dispatched_date);
      if (new Date(received_date) > item.date.dispatched_date) {
        return res.status(400).json({
          message: "you cannot fill date greater than dispatched date",
        });
      }

      if (received_quantity < item.quantity.dispatched_quantity) {
        return res.status(400).json({
          message: "you cannot fill quantity less than dispatched quantity",
        });
      }

      // Update the item with new dispatched date and quantity
      const updatedItem = await Inventory.findByIdAndUpdate(
        req.params.id,
        {
          name,
          date: {
            ...item.date,
            received_date: new Date(received_date),
          },
          quantity: {
            ...item.quantity,
            received_quantity,
          },
        },
        {
          new: true,
        }
      );
      return res
        .status(200)
        .json({ message: "updated Successfully", updatedItem });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete route handler
exports.deleteData = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Inventory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
