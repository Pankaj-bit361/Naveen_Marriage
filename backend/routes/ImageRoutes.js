const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const syncS3ImagesToDB = require('../sync/syncS3');

router.get('/', syncS3ImagesToDB.getPaginatedImages);

router.post('/create', syncS3ImagesToDB.createCollection);
router.post('/add-images', syncS3ImagesToDB.addImagesToCollection);

// Trigger sync with S3
// router.post('/sync', async (req, res) => {
//   try {
//     const count = await syncS3ImagesToDB.syncS3ImagesToDB();
//     res.json({ message: `${count} new images synced.` });
//   } catch (err) {
//     res.status(500).json({ error: 'Sync failed', details: err.message });
//   }
// });

module.exports = router;
