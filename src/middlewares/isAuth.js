const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ msg: "missing authorization token" });
  }

  const tokenValidado = jwt.verify(token, "Secret não poderia estar hardcoded");
  console.log({ tokenValidado });

  req.user = tokenValidado;
  next();
};

module.exports = { isAuth };
