import { Navbar } from "@/components/Navbar";
import { CheckCircle } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-display font-bold text-primary mb-6">Our Philosophy</h1>
            <div className="h-1.5 w-24 bg-secondary mb-8 rounded-full" />
            
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              At <strong className="text-primary font-semibold">Hajime Club</strong>, we believe that martial arts is more than just fighting—it is a way of life. Founded on the principles of mutual welfare and maximum efficiency, our club is a sanctuary for those seeking physical strength and mental clarity.
            </p>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Our training environment is rigorous yet supportive. We focus on Judo fundamentals, practical self-defense, and character development. Whether you are a beginner or experienced, you will find challenges that help you grow.
            </p>

            <div className="space-y-4">
              {[
                "Experienced Instructors focused on safety",
                "Structured curriculum for all levels",
                "Emphasis on discipline and respect",
                "Regular practice sessions (3x per week)"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle className="text-secondary w-6 h-6 flex-shrink-0" />
                  <span className="text-foreground font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="relative">
            {/* judo training image */}
            <img 
              src="https://pixabay.com/get/g12262965a8e2a2e2efacdf7e8b131f675c26b7328738e0694da09199e769a21b9b214053ceb68a7fb4feae18081767d6b7fdd6b88ff78bfc242aedc857925039_1280.jpg"
              alt="Judo Training"
              className="rounded-2xl shadow-2xl z-10 relative"
            />
            <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-secondary/20 rounded-2xl z-0" />
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-secondary/10 rounded-full z-0 blur-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
