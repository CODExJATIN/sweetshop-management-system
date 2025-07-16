const express = require('express');
const router = express.Router();
const { addSweet,getAllSweets,deleteSweetById, searchSweets } = require('../controllers/sweetController');

// Add Sweet
router.post('/', addSweet);
router.get('/',getAllSweets);
router.delete('/:id', deleteSweetById);
router.get('/search', searchSweets);

module.exports = router;
