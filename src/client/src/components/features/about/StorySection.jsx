const StorySection = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <img
            src="https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&h=600&fit=crop"
            alt="SweetieBakery Store"
            className="rounded-2xl shadow-lg w-full"
          />
        </div>
        <div>
          <h2 className="text-3xl mb-4">Câu Chuyện Của Chúng Tôi</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              SweetieBakery được thành lập vào năm 2010 với niềm đam mê làm bánh
              và mong muốn mang đến những sản phẩm bánh ngọt chất lượng cao cho
              người Việt Nam.
            </p>
            <p>
              Bắt đầu từ một tiệm bánh nhỏ, chúng tôi đã không ngừng phát triển
              và hoàn thiện công thức để tạo ra những chiếc bánh vừa đẹp mắt,
              vừa thơm ngon với nguyên liệu tươi sạch được tuyển chọn kỹ lưỡng.
            </p>
            <p>
              Ngày nay, SweetieBakery tự hào là một trong những thương hiệu bánh
              kem và bánh ngọt được yêu thích nhất, với hơn 10 cửa hàng trên
              toàn quốc và hàng nghìn khách hàng hài lòng.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="text-center">
              <p
                className="text-3xl text-[#F7B5D5] mb-1"
                style={{ fontWeight: 700 }}
              >
                14+
              </p>
              <p className="text-sm text-muted-foreground">Năm Kinh Nghiệm</p>
            </div>
            <div className="text-center">
              <p
                className="text-3xl text-[#F7B5D5] mb-1"
                style={{ fontWeight: 700 }}
              >
                10+
              </p>
              <p className="text-sm text-muted-foreground">Cửa Hàng</p>
            </div>
            <div className="text-center">
              <p
                className="text-3xl text-[#F7B5D5] mb-1"
                style={{ fontWeight: 700 }}
              >
                50K+
              </p>
              <p className="text-sm text-muted-foreground">Khách Hàng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;
