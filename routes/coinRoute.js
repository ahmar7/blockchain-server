let express = require("express");

const { isAuthorizedUser, authorizedRoles } = require("../middlewares/auth");
const {
  addCoins,
  getCoins,
  updateCoinAddress,
  createTransaction,
  updateTransaction,
  getTransactions,
  getEachUser,
  getCoinsUser,
  getUserCoin,
  deleteEachUser,
  createUserTransaction,
} = require("../controllers/coinsController");

let router = express.Router();

router
  .route("/addCoins/:id")
  .patch(isAuthorizedUser, authorizedRoles("admin"), addCoins);
router
  .route("/updateCoinAddress/:id")
  .patch(isAuthorizedUser, authorizedRoles("admin"), updateCoinAddress);
router
  .route("/getCoins/:id")
  .get(isAuthorizedUser, authorizedRoles("admin"), getCoins);
router.route("/getUserCoin/:id").get(isAuthorizedUser, getUserCoin);

router.route("/getCoinsUser/:id").get(isAuthorizedUser, getCoinsUser);
router
  .route("/createTransaction/:id")
  .patch(isAuthorizedUser, authorizedRoles("admin"), createTransaction);
router
  .route("/createUserTransaction/:id")
  .patch(isAuthorizedUser, createUserTransaction);
router
  .route("/updateTransaction/:id")
  .patch(isAuthorizedUser, authorizedRoles("admin"), updateTransaction);
router
  .route("/getTransactions")
  .get(isAuthorizedUser, authorizedRoles("admin"), getTransactions);
router
  .route("/getEachUser/:id")
  .get(isAuthorizedUser, authorizedRoles("admin"), getEachUser);
router
  .route("/deleteEachUser/:id")
  .delete(isAuthorizedUser, authorizedRoles("admin"), deleteEachUser);

module.exports = router;
