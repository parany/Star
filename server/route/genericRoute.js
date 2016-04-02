
var router = require('express').Router();
var genericLogic = require('../logic/genericLogic.js');

router.get('/summary', genericLogic.getTotal);
router.get('/:collectionName/findAll', genericLogic.findAll);
router.post('/:collectionName/find', genericLogic.find);
router.get('/:collectionName/findOne/:id', genericLogic.findOne);
router.post('/:collectionName/update', genericLogic.update);
router.post('/:collectionName/insert', genericLogic.insert);
router.get('/:collectionName/getByDate/:date', genericLogic.getByDate);
router.get('/:collectionName/delete/:id', genericLogic.delete);
router.post('/:collectionName/search/:text', genericLogic.search);
router.get('/:collectionName/getArticlesInTheSameDate/:date', genericLogic.getArticlesInTheSameDate);
router.get('/:collectionName/getPrevNearArticles/:date', genericLogic.getPrevNearArticles);
router.get('/:collectionName/getNextNearArticles/:date', genericLogic.getNextNearArticles);

module.exports = router;