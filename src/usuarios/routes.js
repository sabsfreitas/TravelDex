const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const router = Router();

const UsuariosController = require('./controller');
const controller = new UsuariosController();

router.post('/', (req, res) => controller.create(req, res));
router.post('/auth', (req, res) => controller.auth(req, res));
router.get('/list', (req, res) => controller.list(req, res));
//router.put('/updateAccount', isAuth, (req, res) => controller.update(req, res));
//router.delete('/deleteAccount', isAuth, (req, res) => controller.delete(req, res));

module.exports = router;