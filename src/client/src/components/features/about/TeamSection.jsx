import { TEAM_MEMBERS as team_members } from "../../../data/AboutPageData.js";

const TeamSection = () => {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl mb-3">Đội Ngũ Của Chúng Tôi</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Những người thợ làm bánh tài năng và nhiệt huyết
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {team_members.map((member, index) => (
          <div
            key={index}
            className="bg-white border-2 border-[#F7B5D5]/20 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col"
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h4 className="mb-1">{member.name}</h4>
              <p className="text-sm text-[#F7B5D5] mb-2">{member.role}</p>
              <p className="text-sm text-muted-foreground">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TeamSection;
