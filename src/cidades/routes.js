const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const router = Router();

const CidadesController = require('./controller');
const controller = new CidadesController();

router.post('/', isAuth, (req, res) => controller.create(req, res));
router.get('/', isAuth, (req, res) => controller.list(req, res));
router.get('/:id', isAuth, (req, res) => controller.detail(req, res));
//router.put('/:id', isAuth, (req, res) => controller.update(req, res));
//router.delete('/:id', isAuth, (req, res) => controller.delete(req, res));

module.exports = router;