import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 bg-gradient-primary relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary-foreground/20 mb-4">
            <Smartphone className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-primary-foreground">Available on Android</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-primary-foreground leading-tight">
            Ready to Transform
            <span className="text-accent block mt-2">Your Farming?</span>
          </h2>

          <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
            Join thousands of Kenyan farmers already using AI-powered insights to grow better crops 
            and increase their yields. Start your free trial today.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
            <Button variant="hero" size="lg" className="group text-lg px-8 py-6">
              Get Started Free
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-6 bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 backdrop-blur-sm"
            >
              Contact Sales
            </Button>
          </div>

          <div className="pt-8 text-sm text-primary-foreground/70">
            No credit card required • 30-day free trial • Cancel anytime
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
