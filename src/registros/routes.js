const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const router = Router();

const RegistrosController = require('./controller');
const controller = new RegistrosController();

router.post('/', isAuth, (req, res) => controller.create(req, res));
router.get('/list', (req, res) => controller.list(req, res));
router.get('/:id', (req, res) => controller.detail(req, res));
router.put('/:id', isAuth, (req, res) => controller.update(req, res));
router.delete('/:id', isAuth, (req, res) => controller.delete(req, res));

module.exports = router;