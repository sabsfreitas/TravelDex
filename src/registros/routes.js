const { Router } = require('express');
const { isAuth } = require('../middlewares/isAuth');
const { upload } = require('../config/multer-config');
const router = Router();

const RegistrosController = require('./controller');
const controller = new RegistrosController();

router.post('/:idCidade', isAuth, upload.single('foto'), (req, res) => controller.create(req, res));
router.delete('/:id', isAuth, (req, res) => controller.delete(req, res));

module.exports = router;