var router = require('express').Router();

router.use('/albums', require('./albums'));
router.use('/users', require('./users'));
router.use('/sessions', require('./sessions'));

module.exports = router;
