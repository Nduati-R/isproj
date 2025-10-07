import { MapPin, Cloud, Leaf, Smartphone, Globe, Wifi } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: MapPin,
    title: "GPS-Based Recommendations",
    description: "Get crop suggestions tailored to your exact location and local climate conditions.",
  },
  {
    icon: Cloud,
    title: "Real-Time Weather Data",
    description: "Access up-to-date weather patterns and seasonal forecasts to plan your planting.",
  },
  {
    icon: Leaf,
    title: "Soil Analysis",
    description: "Understand your soil characteristics and receive optimal crop matches for your land.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Easy-to-use interface designed for smartphones, accessible anywhere in Kenya.",
  },
  {
    icon: Globe,
    title: "Swahili Support",
    description: "Full language support in Swahili to ensure accessibility for all farmers.",
  },
  {
    icon: Wifi,
    title: "Offline Functionality",
    description: "Access key features and previous recommendations even without internet connection.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Powerful Features for
            <span className="text-primary block mt-2">Better Farming</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to make informed decisions about your crops, all in one intelligent platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-medium transition-all duration-300 hover:-translate-y-2 border-border bg-card animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
