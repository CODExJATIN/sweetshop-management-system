const express = require('express');
const router = express.Router();
const { addSweet,getAllSweets,deleteSweetById } = require('../controllers/sweetController');

// Add Sweet
router.post('/', addSweet);
router.get('/',getAllSweets);
router.delete('/:id', deleteSweetById);

module.exports = router;
