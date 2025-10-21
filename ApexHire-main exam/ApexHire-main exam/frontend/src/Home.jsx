import React from "react";
import { Badge } from './Components/ui/badge';
import { Button } from './Components/ui/button';
import { Card } from './Components/ui/card';
import {
  Building2,
  Users,
  Target,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.css"; // Import the CSS file

export default function Home() {
  const features = [
    {
      icon: Target,
      title: "AI-Powered Matching",
      description: "Find the perfect candidates with our intelligent matching algorithm",
      color: "feature-icon-blue",
    },
    {
      icon: Zap,
      title: "30% Faster Hiring",
      description: "Streamline your recruitment process and fill positions quicker",
      color: "feature-icon-purple",
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Track metrics and optimize your recruitment strategy",
      color: "feature-icon-orange",
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance with industry standards",
      color: "feature-icon-green",
    },
  ];

  const stats = [
    { value: "50K+", label: "Active Candidates" },
    { value: "5,000+", label: "Companies Trust Us" },
    { value: "30%", label: "Faster Hiring" },
    { value: "95%", label: "Match Accuracy" },
  ];

  const testimonials = [
    {
      name: "Jennifer Martinez",
      role: "VP of Talent, TechCorp",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
      quote: "TalentHub transformed our hiring process. We've reduced time-to-hire by 40%.",
    },
    {
      name: "Robert Chen",
      role: "Head of HR, StartupX",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      quote: "The AI matching is incredible. We're finding better candidates faster than ever.",
    },
    {
      name: "Sarah Williams",
      role: "Recruiting Manager, Global Inc",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150",
      quote: "Best investment we've made in our recruitment tech stack. Highly recommend!",
    },
  ];

  return (
    <div className="talent-hub-home">
      {/* Navigation */}
      <nav className="talent-hub-nav">
        <div className="nav-container">
          <div className="nav-content">
            <div className="logo-container">
              <div className="logo-icon">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <span className="logo-text">TalentHub</span>
            </div>

            <div className="nav-actions">
              <Link to="/recruiter/login">
                <Button variant="ghost" className="btn btn-ghost">Sign In</Button>
              </Link>
              <Link to="/recruiter/login">
                <Button className="btn btn-primary">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-grid">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="hero-content"
            >
              <div className="hero-badge">
                <Sparkles className="w-4 h-4 mr-2" />
                Trusted by 5,000+ Companies
              </div>

              <h1 className="hero-title">
                Find Your Next
                <br />
                <span className="gradient-text">Star Hire</span>
              </h1>

              <p className="hero-description">
                Connect with top talent, streamline your hiring pipeline, and build
                exceptional teams faster than ever with AI-powered recruitment.
              </p>

              <div className="hero-actions">
                <Link to="/recruiter/login">
                  <Button size="lg" className="btn btn-primary btn-lg">
                    Start Hiring Today
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="btn btn-outline btn-lg">
                  Watch Demo
                </Button>
              </div>

              <div className="hero-stats">
                {stats.slice(0, 3).map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="stat-item"
                  >
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hero-visual"
            >
              <div className="z-10">
                <img
                  src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800"
                  alt="Team collaboration"
                  className="hero-image"
                />
              </div>
              <div className="hero-blur-1" />
              <div className="hero-blur-2" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <div className="section-header">
            <div className="section-badge">
              <Target className="w-4 h-4 mr-2" />
              Platform Features
            </div>
            <h2 className="section-title">Everything You Need to Hire Smarter</h2>
            <p className="section-description">
              Powerful tools designed to transform your recruitment process
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="feature-card">
                  <div className={`feature-icon ${feature.color}`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="section-header">
            <div className="section-badge">
              <Users className="w-4 h-4 mr-2" />
              Testimonials
            </div>
            <h2 className="section-title">Loved by Recruiters Worldwide</h2>
            <p className="section-description">
              See what industry leaders are saying about TalentHub
            </p>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="testimonial-card">
                  <div className="testimonial-header">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="testimonial-avatar"
                    />
                    <div className="testimonial-info">
                      <h4>{testimonial.name}</h4>
                      <p>{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="testimonial-quote">"{testimonial.quote}"</p>
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="star">⭐</div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <Card className="cta-card">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <h2 className="cta-title">Ready to Transform Your Hiring?</h2>
              <p className="cta-description">
                Join thousands of companies using TalentHub to build exceptional teams
              </p>
              <div className="cta-actions">
                <Link to="/recruiter/login">
                  <Button size="lg" className="btn btn-white btn-lg">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="btn btn-outline-white btn-lg"
                >
                  Schedule Demo
                </Button>
              </div>
              <div className="cta-features">
                <div className="cta-feature">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>No credit card required</span>
                </div>
                <div className="cta-feature">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>14-day free trial</span>
                </div>
              </div>
            </motion.div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="talent-hub-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="footer-logo-icon">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <span className="footer-logo-text">TalentHub</span>
              </div>
              <p className="footer-tagline">The future of recruitment is here.</p>
            </div>

            <div className="footer-column">
              <h3>Product</h3>
              <ul className="footer-links">
                <li><a>Features</a></li>
                <li><a>Pricing</a></li>
                <li><a>Integrations</a></li>
                <li><a>API</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Company</h3>
              <ul className="footer-links">
                <li><a>About</a></li>
                <li><a>Careers</a></li>
                <li><a>Blog</a></li>
                <li><a>Contact</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Legal</h3>
              <ul className="footer-links">
                <li><a>Privacy</a></li>
                <li><a>Terms</a></li>
                <li><a>Security</a></li>
                <li><a>Compliance</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            © 2024 TalentHub. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}