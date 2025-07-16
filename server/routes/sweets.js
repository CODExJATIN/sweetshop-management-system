const express = require('express');
const router = express.Router();
const { addSweet,getAllSweets,deleteSweetById, searchSweets, purchaseSweet } = require('../controllers/sweetController');

// Add Sweet
router.post('/', addSweet);
router.get('/',getAllSweets);
router.delete('/:id', deleteSweetById);
router.get('/search', searchSweets);
router.post('/:id/purchase', purchaseSweet);

module.exports = router;
