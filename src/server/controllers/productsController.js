import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

import { slugGenerator } from '../utils/slugGenerator.js';

const normalizeImages = (images = []) => {
    if (!Array.isArray(images)) return [];
    return images
        .filter((img) => img && img.public_id && img.url)
        .map((img) => ({
            public_id: String(img.public_id).trim(),
            url: String(img.url).trim(),
        }));
};

const parseNumber = (value, fallback) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
};

export async function getAllProducts(req, res) {
    try {
        const {
            keyword,
            category,
            sort = '-createdAt',
        } = req.query;

        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.max(1, parseInt(req.query.limit, 10) || 12);
        const filter = { isDeleted: false };

        if (keyword?.trim()) {
            const regex = new RegExp(keyword.trim(), 'i');
            filter.$or = [{ name: regex }, { description: regex }];
        }

        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ success: false, message: 'Category ID không hợp lệ' });
            }
            filter.category = category;
        }

        const priceFilter = {};
        const priceGte = req.query['price[gte]'] ?? req.query.priceGte;
        const priceLte = req.query['price[lte]'] ?? req.query.priceLte;

        const minPrice = parseNumber(priceGte, undefined);
        const maxPrice = parseNumber(priceLte, undefined);

        if (minPrice !== undefined) priceFilter.$gte = minPrice;
        if (maxPrice !== undefined) priceFilter.$lte = maxPrice;
        if (Object.keys(priceFilter).length) filter.price = priceFilter;

        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product.find(filter)
                .sort(sort || '-createdAt')
                .skip(skip)
                .limit(limit)
                .populate('category', 'name'),
            Product.countDocuments(filter),
        ]);

        res.status(200).json({
            success: true,
            count: products.length,
            totalPage: Math.ceil(total / limit) || 0,
            totalItems: total,
            currentPage: page,
            products,
        });
    } catch (error) {
        console.error('getAllProducts error:', error);
        res.status(500).json({ success: false, message: 'Không thể lấy danh sách sản phẩm', error: error.message });
    }
}

export async function getProductById(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'ID sản phẩm không hợp lệ' });
    }

    try {
        const product = await Product.findOne({ _id: id, isDeleted: false }).populate('category', 'name');

        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error('getProductById error:', error);
        res.status(500).json({ success: false, message: 'Không thể lấy chi tiết sản phẩm', error: error.message });
    }
}

export async function createProduct(req, res) {
    const { name, price, description, category, stock, images, priceSale } = req.body || {};

    const trimmedName = name?.trim();
    const trimmedDescription = description?.trim();

    if (!trimmedName || !trimmedDescription) {
        return res.status(400).json({ success: false, message: 'Tên và mô tả sản phẩm là bắt buộc' });
    }

    const numericPrice = parseNumber(price, undefined);
    const numericStock = parseNumber(stock, undefined);

    if (numericPrice === undefined || numericStock === undefined) {
        return res.status(400).json({ success: false, message: 'Giá và số lượng tồn kho phải là số' });
    }

    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
        return res.status(400).json({ success: false, message: 'Category ID không hợp lệ' });
    }

    const normalizedImages = normalizeImages(images);

    if (!normalizedImages.length) {
        return res.status(400).json({ success: false, message: 'Ít nhất một ảnh hợp lệ là bắt buộc' });
    }

    try {
        const categoryExists = await Category.exists({ _id: category });

        if (!categoryExists) {
            return res.status(404).json({ success: false, message: 'Danh mục không tồn tại' });
        }

        const slug = await slugGenerator(trimmedName);

        const product = await Product.create({
            name: trimmedName,
            slug,
            price: numericPrice,
            priceSale: parseNumber(priceSale, 0) || 0,
            description: trimmedDescription,
            category,
            stock: numericStock,
            images: normalizedImages,
        });

        res.status(201).json({ success: true, message: 'Tạo sản phẩm thành công', data: product });
    } catch (error) {
        console.error('createProduct error:', error);
        res.status(500).json({ success: false, message: 'Không thể tạo sản phẩm', error: error.message });
    }
}

export async function updateProduct(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'ID sản phẩm không hợp lệ' });
    }

    try {
        const product = await Product.findOne({ _id: id, isDeleted: false });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        const { name, price, description, category, stock, images, priceSale, isDeleted, ...rest } = req.body || {};

        if (isDeleted !== undefined) {
            return res.status(400).json({ success: false, message: 'Không thể chỉnh sửa trạng thái xóa bằng API này' });
        }

        if (name?.trim()) {
            product.name = name.trim();
            product.slug = await ensureUniqueSlug(name.trim(), product._id);
        }

        if (description?.trim()) {
            product.description = description.trim();
        }

        if (price !== undefined) {
            const numericPrice = parseNumber(price, undefined);
            if (numericPrice === undefined) {
                return res.status(400).json({ success: false, message: 'Giá không hợp lệ' });
            }
            product.price = numericPrice;
        }

        if (priceSale !== undefined) {
            const numericPriceSale = parseNumber(priceSale, undefined);
            if (numericPriceSale === undefined) {
                return res.status(400).json({ success: false, message: 'Giá khuyến mãi không hợp lệ' });
            }
            product.priceSale = numericPriceSale;
        }

        if (stock !== undefined) {
            const numericStock = parseNumber(stock, undefined);
            if (numericStock === undefined) {
                return res.status(400).json({ success: false, message: 'Số lượng tồn kho không hợp lệ' });
            }
            product.stock = numericStock;
        }

        if (category) {
            if (!mongoose.Types.ObjectId.isValid(category)) {
                return res.status(400).json({ success: false, message: 'Category ID không hợp lệ' });
            }

            const categoryExists = await Category.exists({ _id: category });
            if (!categoryExists) {
                return res.status(404).json({ success: false, message: 'Danh mục không tồn tại' });
            }

            product.category = category;
        }

        if (images !== undefined) {
            const normalizedImages = normalizeImages(images);
            if (images && !normalizedImages.length) {
                return res.status(400).json({ success: false, message: 'Danh sách ảnh không hợp lệ' });
            }
            product.images = normalizedImages;
        }

        if (rest.sold !== undefined) product.sold = parseNumber(rest.sold, product.sold);
        if (rest.rating !== undefined) product.rating = parseNumber(rest.rating, product.rating);
        if (rest.numReviews !== undefined) product.numReviews = parseNumber(rest.numReviews, product.numReviews);

        await product.save();

        res.status(200).json({ success: true, message: 'Cập nhật sản phẩm thành công', data: product });
    } catch (error) {
        console.error('updateProduct error:', error);
        res.status(500).json({ success: false, message: 'Không thể cập nhật sản phẩm', error: error.message });
    }
}

export async function deleteProduct(req, res) {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: 'ID sản phẩm không hợp lệ' });
    }

    try {
        const product = await Product.findById(id);

        if (!product || product.isDeleted) {
            return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
        }

        product.isDeleted = true;
        await product.save();

        res.status(200).json({ success: true, message: 'Đã xóa sản phẩm', data: { id: product._id } });
    } catch (error) {
        console.error('deleteProduct error:', error);
        res.status(500).json({ success: false, message: 'Không thể xóa sản phẩm', error: error.message });
    }
}