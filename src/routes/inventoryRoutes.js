// routes/inventory/inventoryRoutes.js
const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController.js");
const authenticateToken = require("../middleware/authenticationToken.js");

// Create route
router.post(
  "/create-inventory",
  authenticateToken,
  inventoryController.createData
);
router.get("/fetch-inventory", inventoryController.fetchData);
router.put(
  "/update-inventory/:id",
  authenticateToken,
  inventoryController.updateData
);
router.delete(
  "/delete-inventory/:id",
  authenticateToken,
  inventoryController.deleteData
);

module.exports = router;
