import cloudinary from '../config/cloudinary.js';

// POST /upload
export const uploadImage = (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Không có file nào được tải lên.' });
    }

    res.status(200).json({
        success: true,
        message: 'Upload ảnh thành công',
        data: {
            url: req.file.path,      // Link ảnh trên Cloudinary
            public_id: req.file.filename // ID để sau này xóa ảnh
        }
    });
};

// DELETE /upload
export const deleteImage = async (req, res) => {
    try {
        const { public_id } = req.body;

        if (!public_id) {
            return res.status(400).json({ success: false, message: 'Cần cung cấp public_id của ảnh để xóa.' });
        }

        // Gọi API của Cloudinary để xóa
        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result !== 'ok') {
            return res.status(500).json({ 
                success: false, 
                message: 'Không thể xóa ảnh trên Cloudinary.', 
                detail: result 
            });
        }

        res.status(200).json({ success: true, message: 'Đã xóa ảnh thành công.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};