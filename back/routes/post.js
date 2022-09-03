const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const multer = require('../middlewares/multer-config');
const validateCreate = require('../middlewares/validate-create');
const validateModif = require('../middlewares/validate-modif');
const validateRequest = require('../middlewares/validate-request');
const postCtrl = require('../controllers/post');

router.get('/', auth, postCtrl.getAllPost);
router.post('/', auth, multer, validateCreate, validateRequest, postCtrl.createPost);
router.get('/:id', auth, postCtrl.getOnePost);
router.put('/:id', auth, multer, validateModif, validateRequest, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.post('/:id/like', auth, postCtrl.getPostLike);

module.exports = router;