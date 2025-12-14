import { CORE_VALUES as core_values } from "../../../data/AboutPageData";

const CoreValuesSection = () => {
  return (
    <section className="bg-[#FFF0D9]/30 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl mb-3">Giá Trị Cốt Lõi</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Những giá trị mà chúng tôi luôn theo đuổi và duy trì trong mọi sản
            phẩm
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {core_values.map((value, index) => (
            <div
              key={index}
              className="bg-white border-2 border-[#F7B5D5]/20 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
            >
              <div className="p-6 text-center flex flex-col items-center h-full">
                <div className="w-16 h-16 bg-[#F7B5D5]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-[#F7B5D5]" />
                </div>
                <h3 className="text-xl mb-3">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoreValuesSection;
