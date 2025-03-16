const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const router = Router();

const UsuariosController = require('./controller');
const controller = new UsuariosController();

router.post('/register', (req, res) => controller.create(req, res));
router.post('/auth', (req, res) => controller.auth(req, res));
router.get('/', isAuth, (req, res) => controller.list(req, res));
router.get('/profile/:email', isAuth, (req, res) => controller.profile(req, res));
router.get('/search', isAuth, (req, res) => controller.buscaUsuarios(req, res));
router.put('/deleteAccount', isAuth, (req, res) => controller.delete(req, res));

module.exports = router;