const express = require("express");
const {
  getAllProducts,
  addProduct,
  productDetails,
  updateProduct,
  deleteProduct,
  test,
} = require("../controllers/productController");
const { isAuthorizedUser, authorizedRoles } = require("../middlewares/auth");
let router = express.Router();
router.route("/test").get(test);
// poduct controller route
router.route("/products").get(getAllProducts);
router
  .route("/new/product")
  .post(isAuthorizedUser, authorizedRoles("admin"), addProduct);
router
  .route("/product/:id")
  .get(productDetails)
  .put(isAuthorizedUser, authorizedRoles("admin"), updateProduct)
  .delete(isAuthorizedUser, authorizedRoles("admin"), deleteProduct);

module.exports = router;
