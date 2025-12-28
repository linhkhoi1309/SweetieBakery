import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Package,
  Upload,
} from "lucide-react";
import toast from "react-hot-toast";

import { http } from "../../libs/http";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Label } from "../../components/ui/Label";
import { Badge } from "../../components/ui/Badge";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/Dialog";

const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Trạng thái cho Modal (Sử dụng Sheet)
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Thêm state để lưu file ảnh đã chọn
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    priceSale: "0",
    description: "",
    category: "",
    stock: "",
    imageUrl: "",
  });

  // 1. Lấy dữ liệu từ API
  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const [prodRes, catRes] = await Promise.all([
        http.get(`/products?keyword=${searchQuery}&limit=100`), // Lấy nhiều để quản lý
        http.get("/categories"),
      ]);
      setProducts(prodRes.data.products || []);
      setCategories(catRes.data.categories || catRes.data.data || []);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery]);

  // 2. Xử lý Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý khi chọn file ảnh
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // Tạo link xem trước tạm thời
    }
  };

  const handleOpenDialog = (product = null) => {
    setSelectedFile(null);
    if (product) {
      setEditingProduct(product);
      setPreviewUrl(product.images?.[0]?.url || "");
      setFormData({
        name: product.name,
        price: product.price.toString(),
        priceSale: (product.priceSale || 0).toString(),
        description: product.description,
        category: product.category?._id || product.category,
        stock: product.stock.toString(),
        imageUrl: product.images?.[0]?.url || "",
      });
    } else {
      setEditingProduct(null);
      setPreviewUrl("");
      setFormData({
        name: "",
        price: "",
        priceSale: "0",
        description: "",
        category: categories[0]?._id || "",
        stock: "",
        imageUrl: "",
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile && !formData.imageUrl.trim() && !editingProduct) {
      return toast.error("Vui lòng tải ảnh lên hoặc nhập đường dẫn ảnh!");
    }

    setIsSubmitting(true);

    try {
      let imageData = editingProduct ? editingProduct.images : [];

      // TRƯỜNG HỢP 1: Ưu tiên tải file từ máy tính lên Cloudinary
      if (selectedFile) {
        const uploadData = new FormData();
        uploadData.append("image", selectedFile);
        const uploadRes = await http.post("/upload", uploadData);

        if (uploadRes.data.success) {
          imageData = [
            {
              public_id: uploadRes.data.data.public_id,
              url: uploadRes.data.data.url,
            },
          ];
        }
      }
      // TRƯỜNG HỢP 2: Nếu không có file nhưng có nhập URL thủ công
      else if (formData.imageUrl.trim()) {
        imageData = [
          {
            public_id: `manual_${Date.now()}`, // Tạo ID giả cho các ảnh nhập link
            url: formData.imageUrl.trim(),
          },
        ];
      }
      // TRƯỜNG HỢP 3: Giữ nguyên ảnh cũ nếu đang Edit và không thay đổi gì
      else if (editingProduct) {
        imageData = editingProduct.images;
      }

      // Chuẩn bị payload thông tin sản phẩm kèm ảnh mới
      const payload = {
        name: formData.name.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: formData.description.trim(),
        category: formData.category,
        images: imageData,
      };

      if (editingProduct) {
        await http.put(`/products/${editingProduct._id}`, payload);
        toast.success("Cập nhật thành công!");
      } else {
        await http.post("/products", payload);
        toast.success("Thêm sản phẩm mới thành công!");
      }

      setIsDialogOpen(false);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) {
      try {
        await http.delete(`/products/${id}`);
        toast.success("Đã xóa sản phẩm");
        fetchProducts();
      } catch (error) {
        toast.error("Xóa thất bại");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản Lý Sản Phẩm</h1>
          <p className="text-gray-500">
            Quản lý danh mục sản phẩm của cửa hàng
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-[#F7B5D5] hover:bg-[#f39cb4] text-white rounded-xl h-11 px-6 shadow-lg shadow-pink-100"
        >
          <Plus className="mr-2 h-5 w-5" />
          Thêm sản phẩm mới
        </Button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-pink-50 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Tìm kiếm sản phẩm theo tên..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-pink-200"
          />
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl border border-pink-50 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-800">
            Danh sách sản phẩm ({products.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Ảnh</th>
                <th className="py-4 px-6 font-semibold">Tên sản phẩm</th>
                <th className="py-4 px-6 font-semibold">Danh mục</th>
                <th className="py-4 px-6 font-semibold">Giá</th>
                <th className="py-4 px-6 font-semibold text-center">Tồn kho</th>
                <th className="py-4 px-6 font-semibold text-center">
                  Đánh giá
                </th>
                <th className="py-4 px-6 font-semibold text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#F7B5D5]" />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center text-gray-400">
                    Chưa có sản phẩm nào.
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-pink-50/20 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-pink-100">
                        <img
                          src={
                            product.images?.[0]?.url ||
                            "https://placehold.co/100x100?text=No+Image"
                          }
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="font-bold text-gray-800 line-clamp-1">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-gray-400 font-mono uppercase">
                        ID: {product._id.slice(-6)}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant="outline"
                        className="bg-pink-50 text-[#F7B5D5] border-pink-100 rounded-lg"
                      >
                        {product.category?.name || "Chưa phân loại"}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 font-bold text-gray-700">
                      {product.price.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`font-bold ${
                          product.stock < 10 ? "text-red-500" : "text-green-500"
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-medium text-yellow-600">
                      ⭐ {product.rating || 0}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenDialog(product)}
                          className="p-2 hover:bg-blue-50 text-blue-500 rounded-lg transition-colors"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sử dụng Dialog bản thủ công */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent onOpenChange={setIsDialogOpen}>
          <DialogHeader>
            <DialogTitle>
              {editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm bánh mới 🧁"}
            </DialogTitle>
            <DialogDescription>
              Vui lòng điền đầy đủ các thông tin bắt buộc đánh dấu dấu *.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5">
              {/* Tên sản phẩm */}
              <div className="space-y-2">
                <Label htmlFor="name" className="ml-1 font-bold">
                  Tên sản phẩm *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="rounded-2xl border-pink-100 h-12"
                />
              </div>

              {/* Giá và Kho */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="ml-1 font-bold">
                    Giá bán (đ) *
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    className="rounded-2xl border-pink-100 h-12"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock" className="ml-1 font-bold">
                    Số lượng kho *
                  </Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    required
                    className="rounded-2xl border-pink-100 h-12"
                  />
                </div>
              </div>

              {/* Danh mục */}
              <div className="space-y-2">
                <Label htmlFor="category" className="ml-1 font-bold">
                  Danh mục *
                </Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="flex h-12 w-full rounded-2xl border border-pink-100 bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  required
                >
                  <option value="" disabled>
                    -- Chọn loại bánh --
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hình ảnh */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="ml-1 font-bold">
                  Đường dẫn ảnh
                </Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="https://..."
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="rounded-2xl border-pink-100 h-12"
                />
              </div>

              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-pink-100"></div>
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                  Hoặc tải lên từ máy
                </p>
                <div className="flex-1 h-px bg-pink-100"></div>
              </div>

              {/* Tải ảnh lên */}
              <div className="space-y-2">
                <Label className="ml-1 font-bold">Hình ảnh sản phẩm</Label>
                <div className="flex items-center gap-4">
                  <div className="relative group w-24 h-24 border-2 border-dashed border-pink-200 rounded-2xl flex items-center justify-center overflow-hidden bg-gray-50">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="text-pink-300 w-8 h-8" />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>
                  <div className="text-xs text-gray-500">
                    <p className="font-bold text-[#F7B5D5]">
                      Click để chọn ảnh
                    </p>
                    <p>Định dạng: JPG, PNG (Tối đa 5MB)</p>
                  </div>
                </div>
              </div>

              {/* Mô tả */}
              <div className="space-y-2">
                <Label htmlFor="description" className="ml-1 font-bold">
                  Mô tả chi tiết *
                </Label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="flex w-full rounded-2xl border border-pink-100 bg-white px-4 py-3 text-sm focus:ring-2 focus:ring-pink-200 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-2xl px-10 h-12 border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-all hover:cursor-pointer"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                className="bg-[#F7B5D5] hover:bg-[#f39cb4] text-white rounded-2xl px-10 h-12 font-bold shadow-lg shadow-pink-100 transition-all active:scale-95 hover:cursor-pointer"
              >
                {editingProduct ? "Cập nhật bánh" : "Thêm vào menu"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagementPage;
