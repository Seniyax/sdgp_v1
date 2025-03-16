import React, { useState, useEffect } from 'react';
import "../style/Home.css";
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Clock, Building, User, Mail, Phone, Check } from 'lucide-react';
import Nishanjali from "../assets/Nishanjali.jpeg";
import Uvindu from "../assets/uvindu.jpeg";
import Seniya from "../assets/seniya.jpeg";
import Ransika from "../assets/ransika.jpeg";
import Abinath from "../assets/abinath.jpeg";
import Kavindu from "../assets/kavindu.jpeg";

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "Smart Scheduling",
      description: "AI-powered scheduling that optimizes your time and reduces no-shows by 35%.",
      icon: <Calendar size={28} />
    },
    {
      title: "Real-time Notifications",
      description: "Keep everyone in the loop with automated reminders and updates.",
      icon: <Clock size={28} />
    },
    {
      title: "Easy Management",
      description: "Simple dashboard for businesses to manage all appointments in one place.",
      icon: <Building size={28} />
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Salon Owner",
      text: "Slotzi has cut our no-show rate by 50% and saved us countless hours of scheduling work."
    },
    {
      name: "Michael Chen",
      role: "Dental Clinic Manager",
      text: "The dual interfaces for businesses and clients make Slotzi the perfect solution for our practice."
    },
    {
      name: "Leila Rodriguez",
      role: "Yoga Studio Instructor",
      text: "My students love how easy it is to book classes. I love how it's automated my entire scheduling process."
    }
  ];

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">Slotzi</div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#team">Our Team</a>
          <a href="#contact">Contact</a>
        </div>
        <div className="mobile-menu-icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <div className={`hamburger ${isMenuOpen ? 'open' : ''}`}></div>
        </div>
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          <a href="#features" onClick={() => setIsMenuOpen(false)}>Features</a>
          <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>How It Works</a>
          <a href="#testimonials" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
          <a href="#team" onClick={() => setIsMenuOpen(false)}>Our Team</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Simplify Reservations. Amplify Business.</h1>
          <p>The smart reservation platform that connects businesses and customers seamlessly.</p>
          <div className="cta-buttons">
            <Link to="/WebFrontend/src/pages/BusinessChoice.jsx" className="btn btn-primary">
                For Users</Link>
            <Link to="/business-choice?type=business" className="btn btn-secondary">
                For Business</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/api/placeholder/480/320" alt="Slotzi App Interface" />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <h2>Why Choose Slotzi</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`feature-card ${activeFeature === index ? 'active' : ''}`}
              onClick={() => setActiveFeature(index)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works">
        <h2>How Slotzi Works</h2>
        <div className="tabs">
          <div className="tab-container">
            <div className="tab-header">
              <button className="tab-button active" data-tab="users">For Users</button>
              <button className="tab-button" data-tab="business">For Business</button>
            </div>
            <div className="tab-content active" id="users">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-info">
                  <h3>Find & Select</h3>
                  <p>Browse businesses and available time slots at your convenience.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-info">
                  <h3>Book Instantly</h3>
                  <p>Secure your reservation with just a few taps - no phone calls needed.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-info">
                  <h3>Get Reminders</h3>
                  <p>Receive timely notifications and never miss an appointment.</p>
                </div>
              </div>
            </div>
            <div className="tab-content" id="business">
              <div className="step">
                <div className="step-number">1</div>
                <div className="step-info">
                  <h3>Set Your Schedule</h3>
                  <p>Define your availability and service durations with our easy-to-use dashboard.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">2</div>
                <div className="step-info">
                  <h3>Manage Bookings</h3>
                  <p>Accept, reschedule, or review all appointments from one central location.</p>
                </div>
              </div>
              <div className="step">
                <div className="step-number">3</div>
                <div className="step-info">
                  <h3>Grow Your Business</h3>
                  <p>Reduce no-shows and increase customer satisfaction with automated workflows.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <h2>What Our Users Say</h2>
        <div className="testimonial-carousel">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="testimonial-card">
              <p>"{testimonial.text}"</p>
              <div className="testimonial-author">
                <h4>{testimonial.name}</h4>
                <span>{testimonial.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src={Nishanjali} alt="Team Member" />
            <h3>Nishanjali Kamalendran</h3>
            <p>CEO & Founder</p>
          </div>
          <div className="team-member">
            <img src={Uvindu} alt="Team Member" />
            <h3>Uvindu Amaratunga</h3>
            <p>Chief Technology Officer</p>
          </div>
          <div className="team-member">
            <img src={Abinath} alt="Team Member" />
            <h3>Riley Smith</h3>
            <p>Head of Customer Success</p>
          </div>
          <div className="team-member">
            <img src={Ransika} alt="Team Member" />
            <h3>Riley Smith</h3>
            <p>Head of Customer Success</p>
          </div>
          <div className="team-member">
            <img src={Seniya} alt="Team Member" />
            <h3>Riley Smith</h3>
            <p>Head of Customer Success</p>
          </div>
          <div className="team-member">
            <img src={Kavindu} alt="Team Member" />
            <h3>Riley Smith</h3>
            <p>Head of Customer Success</p>
          </div>
          
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <h2>Get In Touch</h2>
        <div className="contact-container">
          <div className="contact-info">
            <div className="contact-item">
              <Mail size={20} />
              <p>hello@slotzi.com</p>
            </div>
            <div className="contact-item">
              <Phone size={20} />
              <p>+1 (555) 123-4567</p>
            </div>
            <div className="contact-item">
              <Building size={20} />
              <p>123 Booking Street, App City, AC 12345</p>
            </div>
          </div>
          <form className="contact-form">
            <div className="form-group">
              <input type="text" placeholder="Your Name" required />
            </div>
            <div className="form-group">
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-group">
              <select>
                <option value="" disabled selected>I'm interested in...</option>
                <option value="user">Using Slotzi as a customer</option>
                <option value="business">Using Slotzi for my business</option>
                <option value="partnership">Partnership opportunities</option>
                <option value="other">Other inquiry</option>
              </select>
            </div>
            <div className="form-group">
              <textarea placeholder="Your Message" rows="4" required></textarea>
            </div>
            <button type="submit" className="btn btn-primary">Send Message</button>
          </form>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Transform Your Reservation Experience?</h2>
        <p>Join thousands of satisfied businesses and users.</p>
        <div className="cta-buttons">
          <a href="#users" className="btn btn-primary">
            Get Started as User
            <ArrowRight size={16} />
          </a>
          <a href="#business" className="btn btn-secondary">
            Register Your Business
            <ArrowRight size={16} />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <div className="logo">Slotzi</div>
            <p>Simplify Reservations. Amplify Business.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How It Works</a>
              <a href="#pricing">Pricing</a>
            </div>
            <div className="footer-column">
              <h4>Company</h4>
              <a href="#about">About Us</a>
              <a href="#team">Our Team</a>
              <a href="#careers">Careers</a>
            </div>
            <div className="footer-column">
              <h4>Resources</h4>
              <a href="#blog">Blog</a>
              <a href="#guides">Guides</a>
              <a href="#support">Support</a>
            </div>
            <div className="footer-column">
              <h4>Legal</h4>
              <a href="#terms">Terms of Service</a>
              <a href="#privacy">Privacy Policy</a>
              <a href="#cookies">Cookie Policy</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Slotzi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
