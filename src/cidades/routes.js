const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const router = Router();

const CidadesController = require('./controller');
const controller = new CidadesController();

// router.post('/', (req, res) => controller.create(req, res)); // USUÁRIO NÃO CRIA CIDADE!
router.get('/', isAuth, (req, res) => controller.list(req, res));
router.get('/:id', isAuth, (req, res) => controller.detail(req, res));

module.exports = router;