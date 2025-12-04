// POST /upload
export const uploadImage = (req, res) => {
  // Nếu middleware upload thành công, thông tin file sẽ nằm trong req.file
    if (!req.file) {
        return res.status(400).json({ message: 'Không có file nào được tải lên.' });
    }

    // Trả về đúng format bạn yêu cầu
    res.status(200).json({
        url: req.file.path,      // Link ảnh trên Cloudinary
        public_id: req.file.filename // ID để sau này xóa ảnh nếu cần
    });
};