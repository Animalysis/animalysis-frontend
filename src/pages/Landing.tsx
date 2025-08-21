import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Heart,
  Activity,
  MapPin,
  Shield,
  Smartphone,
  BarChart3,
  ArrowRight,
} from "lucide-react";
import heroImage from "@/assets/hero-pets.jpg";

const Landing = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useAuth();
  const [redirected, setRedirected] = useState(false);
  const features = [
    {
      icon: Heart,
      title: "Health Monitoring",
      description:
        "Track vital signs, heart rate, and overall health status of all your animals in real-time.",
    },
    {
      icon: Activity,
      title: "Activity Tracking",
      description:
        "Monitor daily activities, calories burned, exercise routines, and movement patterns.",
    },
    {
      icon: MapPin,
      title: "Location Tracking",
      description:
        "Keep track of where your animals are at all times with GPS location monitoring.",
    },
    {
      icon: BarChart3,
      title: "Analytics & Insights",
      description:
        "Get detailed reports and insights about your animals' health and activity trends.",
    },
    {
      icon: Shield,
      title: "Health Alerts",
      description:
        "Receive instant notifications when your animals' vitals are outside normal ranges.",
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description:
        "Access your animal data anywhere with our responsive, mobile-first design.",
    },
  ];

  // Redirect signed-in users to dashboard using effect
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      navigate("/dashboard", { replace: true });
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Show loading fallback while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-health-primary/5">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              PetFit Pro
            </span>
          </div>
          <div className="flex gap-2">
            <Link to="/sign-in">
              <Button className="bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300">
                Login
              </Button>
            </Link>
            <Link to="/sign-up">
              <Button
                variant="outline"
                className="border-health-primary text-health-primary hover:bg-health-primary hover:text-white transition-all duration-300"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Your Animals'
                <span className="block bg-gradient-primary bg-clip-text text-transparent">
                  Health First
                </span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                The most comprehensive animal health and fitness tracking
                platform. Monitor vitals, track activities, and ensure your
                beloved animals stay healthy and happy.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/sign-in">
                <Button
                  size="lg"
                  className="bg-gradient-primary hover:bg-gradient-secondary transition-all duration-300 text-lg px-8 py-6"
                >
                  Login
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-health-primary text-health-primary hover:bg-health-primary hover:text-white text-lg px-8 py-6"
                >
                  Sign Up
                </Button>
              </Link>
            </div>

            <div className="flex items-center space-x-8 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-health-primary">
                  10K+
                </div>
                <div className="text-sm text-muted-foreground">
                  Happy Animals
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-health-secondary">
                  99.9%
                </div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-health-accent">
                  24/7
                </div>
                <div className="text-sm text-muted-foreground">Monitoring</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImage}
              alt="Happy pets with health tracking"
              className="rounded-3xl shadow-hover animate-float w-full"
            />
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-secondary rounded-full flex items-center justify-center animate-bounce-gentle">
              <Activity className="w-10 h-10 text-white" />
            </div>
            <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center animate-pulse-slow">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold">
            Everything You Need for
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Animal Wellness
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools you need to
            monitor, track, and maintain your animals' health and fitness.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group border border-white/20 bg-gradient-glass backdrop-blur-sm hover:shadow-hover transition-all duration-300"
            >
              <CardContent className="p-8 space-y-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 lg:p-20 text-center">
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl lg:text-5xl font-bold text-white">
              Ready to Transform Your
              <span className="block">Animal Care?</span>
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Join thousands of animal owners who trust PetFit Pro to keep their
              beloved companions healthy and happy.
            </p>
            <Link to="/sign-up">
              <Button
                size="lg"
                className="bg-white text-health-primary hover:bg-white/90 text-lg px-12 py-6 font-semibold"
              >
                Get Started Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Background decoration */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-bounce-gentle"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-float"></div>
          <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse-slow"></div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-12 border-t border-white/10">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Heart className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold">PetFit Pro</span>
          </div>
          <p className="text-muted-foreground text-center">
            © 2024 PetFit Pro. Keeping your animals healthy and happy.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
