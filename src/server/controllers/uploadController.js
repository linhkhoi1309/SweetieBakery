// POST /upload
export const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Không có file nào được tải lên.' });
    }

    res.status(200).json({
        url: req.file.path,      // Link ảnh trên Cloudinary
        public_id: req.file.filename // ID ảnh
    });
};