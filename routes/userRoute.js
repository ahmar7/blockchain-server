let express = require("express");
const {
  RegisterUser,
  loginUser,
  logoutUser,
  resetPassword,
  allUser,
  singleUser,
  updateSingleUser,
  verifySingleUser,
  getsignUser,
} = require("../controllers/userController");
const { isAuthorizedUser, authorizedRoles } = require("../middlewares/auth");
const singleUpload = require("../middlewares/multer");

let router = express.Router();

router.route("/register").post(RegisterUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logoutUser);
router
  .route("/allUser")
  .get(isAuthorizedUser, authorizedRoles("admin"), allUser);
router
  .route("/singleUser/:id")
  .get(isAuthorizedUser, authorizedRoles("admin"), singleUser);
router
  .route("/updateSingleUser/:id")
  .post(isAuthorizedUser, authorizedRoles("admin"), updateSingleUser);
router
  .route("/verifySingleUser")
  .patch(isAuthorizedUser, singleUpload, verifySingleUser);
router.route("/password/reset").post(resetPassword);
router.route("/getsignUser").patch(singleUpload, getsignUser);

module.exports = router;
