import heroImage from "@/assets/hero-healthcare.jpg";

const HeroSection = () => {
  return (
    <section className="hero-section py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              Your trusted companion for health guidance and wellness support
            </h1>
            <p className="text-lg text-muted-foreground">
              Your trusted companion for health guidance and wellness support
            </p>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="AI Healthcare Assistant"
              className="rounded-2xl shadow-2xl w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
