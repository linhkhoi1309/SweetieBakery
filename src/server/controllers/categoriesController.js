import mongoose from 'mongoose';
import Category from '../models/Category.js';

export async function getAllCategories(req, res) {
	try {
		const categories = await Category.find();
		res.status(200).json({ success: true, data: categories });
	} catch (error) {
		console.error('getAllCategories error:', error);
		res.status(500).json({ success: false, message: 'Không thể lấy danh sách danh mục', error: error.message });
	}
}   

export async function createCategory(req, res) {
	const { name, image } = req.body || {};
	const trimmedName = name?.trim();

	if (!trimmedName) {
		return res.status(400).json({ success: false, message: 'Tên danh mục là bắt buộc' });
	}
    console.log('Creating category with name:', trimmedName);

	try {
		const existingCategory = await Category.findOne({ name: trimmedName });

		if (existingCategory) {
			return res.status(409).json({ success: false, message: 'Danh mục đã tồn tại' });
		}

		const category = await Category.create({
			name: trimmedName,
			image: image?.trim() || '',
		});

		res.status(201).json({ success: true, message: 'Tạo danh mục thành công', data: category });
	} catch (error) {
		console.error('createCategory error:', error);
		res.status(500).json({ success: false, message: 'Không thể tạo danh mục', error: error.message });
	}
}   

export async function deleteCategory(req, res) {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(400).json({ success: false, message: 'ID danh mục không hợp lệ' });
	}

	try {
		const category = await Category.findById(id);

		if (!category) {
			return res.status(404).json({ success: false, message: 'Không tìm thấy danh mục' });
		}

		await category.deleteOne();

		res.status(200).json({ success: true, message: 'Đã xóa danh mục' });
	} catch (error) {
		console.error('deleteCategory error:', error);
		res.status(500).json({ success: false, message: 'Không thể xóa danh mục', error: error.message });
	}
}