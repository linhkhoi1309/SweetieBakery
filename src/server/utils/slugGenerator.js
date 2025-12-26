import Product from '../models/Product.js';

const slugifyText = (text = '') => {
    const base = text
        .toString()
        .normalize("NFD")                    // tách dấu
        .replace(/[\u0300-\u036f]/g, '')     // xóa dấu
        .replace(/đ/g, 'd')                  // xử lý "đ"
        .replace(/Đ/g, 'd')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')         // thay ký tự đặc biệt bằng "-"
        .replace(/^-+|-+$/g, '');            // bỏ dấu - ở đầu/cuối

    return base || `product-${Date.now()}`;
};

export const slugGenerator = async (name, excludeId) => {
    const baseSlug = slugifyText(name);
    let slug = baseSlug;
    let counter = 1;

    const exclusion = excludeId ? { _id: { $ne: excludeId } } : {};

    while (await Product.exists({ slug, ...exclusion })) {
        slug = `${baseSlug}-${counter++}`;
    }

    return slug;
};