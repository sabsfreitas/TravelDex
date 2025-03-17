const jwt = require("jsonwebtoken");
require('dotenv').config()
const { Usuario } = require('../usuarios/model');

const isAuth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Invalid or missing authorization token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const tokenValidado = jwt.verify(token, process.env.JWT_SECRET || "minhaChaveSecreta");
    req.user = tokenValidado;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = { isAuth };
