
import { motion } from "framer-motion";
import { Microscope, RocketIcon, Brain, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: <Brain className="w-8 h-8 text-primary" />,
    title: "AI Project Advisor",
    description: "Get personalized project ideas based on your interests"
  },
  {
    icon: <Microscope className="w-8 h-8 text-secondary" />,
    title: "Research Assistant",
    description: "Access smart research tools and experiment guides"
  },
  {
    icon: <GraduationCap className="w-8 h-8 text-success" />,
    title: "Presentation Coach",
    description: "Get feedback to make your project shine"
  }
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-success bg-clip-text text-transparent">
              Science Fair AI Advisor
            </h1>
            <p className="text-xl mb-8 text-foreground/80">
              Your AI-powered companion for creating amazing science fair projects
            </p>
            <Button
              size="lg"
              className="animated-button text-white px-8 py-6 text-lg rounded-full"
            >
              <span className="relative z-10">Get Started</span>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-foreground/70">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-primary/10 to-success/10 py-20 px-4">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Science Journey?
            </h2>
            <p className="text-xl mb-8 text-foreground/80 max-w-2xl mx-auto">
              Join thousands of young scientists creating amazing projects with AI guidance
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="animated-button px-8 py-6 text-lg rounded-full"
            >
              <span className="relative z-10 text-white">Launch Your Project</span>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
