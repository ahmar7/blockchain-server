// create cookie with token in a function, taking arguments from controller
const jwtToken = (user, statusCode, res) => {
  let token = user.generateToken();
  let options = {
    httpOnly: true,
    expires: new Date(
      Date.now() + process.env.TOKEN_EXPIRE * 24 * 60 * 60 * 1000
    ),
    sameSite: "none",
    secure: true,
  };

  res.status(statusCode).cookie("jwttoken", token, options).json({
    success: true,
    token,
    user,
  });
};
module.exports = jwtToken;
