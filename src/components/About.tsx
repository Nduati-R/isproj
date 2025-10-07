import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import appMockup from "@/assets/app-mockup.jpg";
import aiAnalysis from "@/assets/ai-analysis.jpg";

const benefits = [
  "Increase crop yields by up to 40%",
  "Reduce crop failure risks",
  "Save time on research and planning",
  "Access expert knowledge anytime",
  "Make data-driven decisions",
  "Improve farm profitability",
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        {/* Problem & Solution */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-24">
          <div className="animate-fade-in space-y-6">
            <div className="inline-block bg-accent/10 text-accent px-4 py-2 rounded-full text-sm font-medium mb-2">
              The Challenge
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Kenyan Farmers Need
              <span className="text-primary block mt-2">Better Guidance</span>
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                Over 75% of Kenya's agricultural workforce are smallholder farmers who face low productivity 
                due to limited access to personalized, data-driven guidance.
              </p>
              <p>
                Traditional extension services can't reach everyone - with ratios as low as 1 officer per 2,000-3,000 farmers. 
                Climate change adds unpredictability, making traditional knowledge insufficient.
              </p>
              <p className="font-semibold text-foreground">
                CropAdvisor bridges this gap with AI-powered intelligence accessible to every farmer.
              </p>
            </div>
          </div>

          <div className="relative animate-scale-in">
            <div className="relative rounded-2xl overflow-hidden shadow-medium">
              <img 
                src={appMockup} 
                alt="Mobile app showing crop recommendations"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Benefits */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1 relative animate-scale-in">
            <div className="relative rounded-2xl overflow-hidden shadow-medium">
              <img 
                src={aiAnalysis} 
                alt="AI analyzing agricultural data"
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
          </div>

          <div className="order-1 lg:order-2 animate-fade-in space-y-6">
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-2">
              The Solution
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              AI-Powered Insights
              <span className="text-primary block mt-2">Drive Success</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Our intelligent system combines machine learning with comprehensive datasets 
              from KALRO, Kenya Meteorological Department, and FAO to deliver personalized recommendations.
            </p>

            <ul className="space-y-4">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-lg">{benefit}</span>
                </li>
              ))}
            </ul>

            <Button variant="heroPrimary" size="lg" className="mt-6">
              Learn More About Our AI
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
