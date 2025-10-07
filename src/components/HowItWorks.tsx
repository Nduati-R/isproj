import { MapPin, Brain, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: MapPin,
    title: "Share Your Location",
    description: "Enable GPS on your device to let us understand your farming environment, including local climate and soil conditions.",
    number: "01",
  },
  {
    icon: Brain,
    title: "AI Analysis",
    description: "Our advanced AI analyzes soil data, weather patterns, and historical crop performance in your area.",
    number: "02",
  },
  {
    icon: TrendingUp,
    title: "Get Recommendations",
    description: "Receive personalized crop suggestions with planting schedules, care instructions, and expected yields.",
    number: "03",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Simple Process,
            <span className="text-primary block mt-2">Powerful Results</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Get expert crop advice in three easy steps
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 md:gap-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div 
                  key={index}
                  className="relative animate-scale-in"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  {/* Connection Line */}
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-primary to-primary/20 -z-10"></div>
                  )}

                  <div className="bg-card border border-border rounded-2xl p-8 text-center hover:shadow-medium transition-all duration-300 h-full">
                    <div className="relative inline-block mb-6">
                      <div className="absolute -top-4 -right-4 text-6xl font-bold text-accent/20">
                        {step.number}
                      </div>
                      <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center relative z-10">
                        <Icon className="h-10 w-10 text-primary-foreground" />
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-semibold text-card-foreground mb-4">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
