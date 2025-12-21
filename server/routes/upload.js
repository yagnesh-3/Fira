const express = require('express');
const router = express.Router();
const { upload, uploadSingle, uploadMultiple } = require('../services/uploadService');

// POST /api/upload/single - Upload single image
router.post('/single', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided' });
        }

        const folder = req.body.folder || 'general';
        const result = await uploadSingle(req.file, folder);

        res.json({
            success: true,
            url: result.url,
            publicId: result.publicId,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message || 'Upload failed' });
    }
});

// POST /api/upload/multiple - Upload multiple images
router.post('/multiple', upload.array('images', 5), async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No image files provided' });
        }

        const folder = req.body.folder || 'general';
        const results = await uploadMultiple(req.files, folder);

        res.json({
            success: true,
            images: results,
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ error: error.message || 'Upload failed' });
    }
});

module.exports = router;
