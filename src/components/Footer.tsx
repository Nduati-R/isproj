import { Sprout, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sprout className="h-8 w-8 text-accent" />
              <span className="text-xl font-bold">CropAdvisor</span>
            </div>
            <p className="text-background/70 text-sm leading-relaxed">
              AI-powered crop advisory system helping Kenyan smallholder farmers 
              make better decisions for sustainable agriculture.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-background/70 hover:text-accent transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-background/70 hover:text-accent transition-colors text-sm">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#about" className="text-background/70 hover:text-accent transition-colors text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-accent transition-colors text-sm">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-background/70 hover:text-accent transition-colors text-sm">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-accent transition-colors text-sm">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-accent transition-colors text-sm">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="text-background/70 hover:text-accent transition-colors text-sm">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <Mail className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-background/70">support@cropadvisor.ke</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Phone className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-background/70">+254 700 000 000</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <MapPin className="h-5 w-5 text-accent flex-shrink-0" />
                <span className="text-background/70">Nairobi, Kenya</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-background/60 text-sm">
            © 2025 CropAdvisor. A project by Ryan Nduati, Strathmore University.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-background/70 hover:text-accent transition-colors text-sm">
              Twitter
            </a>
            <a href="#" className="text-background/70 hover:text-accent transition-colors text-sm">
              Facebook
            </a>
            <a href="#" className="text-background/70 hover:text-accent transition-colors text-sm">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
