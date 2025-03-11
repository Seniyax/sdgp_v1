import React, { useState, useEffect, useRef } from 'react';
import { Calendar, ChevronRight, Instagram, Mail, Phone, MapPin, CalendarCheck, Shield, Users2, Crown, Check, ArrowRight, Star, Zap, Gift, Linkedin, Github, Twitter, LucideCode, Network, Database, BarChart, UserPlus } from 'lucide-react';
import "../style/Home.css";
import NishanjaliImage from "../assets/Nishanjali.jpeg";
import UvinduImage from "../assets/uvindu.jpeg";
import AbinathImage from "../assets/abinath.jpeg";
import RansikaImage from "../assets/ransika.jpeg";
import KavinduImage from "../assets/kavindu.jpeg";
import SeniyaImage from "../assets/seniya.jpeg";
import { useNavigate } from 'react-router-dom';
import video from "../assets/finalvideo.mp4";


function Home() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [activeTestimonial, setActiveTestimonial] = useState(0);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [activeFeature, setActiveFeature] = useState(0);
    const [featureInView, setFeatureInView] = useState(null);
    const featuresRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY < 100);
            setLastScrollY(currentScrollY);

            // Check if features section is in view
            if (featuresRef.current) {
                const rect = featuresRef.current.getBoundingClientRect();
                if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                    setFeatureInView(true);
                } else {
                    setFeatureInView(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
            if (!featureInView) {
                setActiveFeature((prev) => (prev + 1) % features.length);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [featureInView]);

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Restaurant Owner",
            content: "SlotZi transformed how we handle reservations. Our bookings increased by 60% in just two months!",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150",
            rating: 5
        },
        {
            name: "Mike Chen",
            role: "Spa Manager",
            content: "The analytics and scheduling features have helped us optimize our business operations perfectly.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150",
            rating: 5
        },
        {
            name: "Emma Davis",
            role: "Salon Owner",
            content: "Customer satisfaction has never been higher. The automated reminders are a game-changer!",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150",
            rating: 5
        }
    ];

    const features = [
        {
            icon: <CalendarCheck className="w-12 h-12" />,
            title: "Smart Scheduling",
            description: "AI-powered scheduling that learns from your business patterns and optimizes appointment times for maximum efficiency.",
            color: "bg-primary-light",
            textColor: "text-primary"
        },
        {
            icon: <Users2 className="w-12 h-12" />,
            title: "Customer Insights",
            description: "Deep analytics about your customers' preferences and behaviors to help you make data-driven decisions.",
            color: "bg-secondary-light",
            textColor: "text-secondary"
        },
        {
            icon: <Shield className="w-12 h-12" />,
            title: "Secure Platform",
            description: "Enterprise-grade security for your business and customer data with end-to-end encryption and regular security audits.",
            color: "bg-tertiary-light",
            textColor: "text-tertiary"
        },
        {
            icon: <Zap className="w-12 h-12" />,
            title: "Instant Notifications",
            description: "Real-time updates for both businesses and customers through email, SMS, and push notifications.",
            color: "bg-accent-light",
            textColor: "text-accent"
        },
        {
            icon: <Database className="w-12 h-12" />,
            title: "Advanced Analytics",
            description: "Comprehensive reporting and analytics dashboard to track performance and identify growth opportunities.",
            color: "bg-primary-light",
            textColor: "text-primary"
        },
        {
            icon: <Network className="w-12 h-12" />,
            title: "Seamless Integrations",
            description: "Connect with your favorite tools through our extensive API and pre-built integrations with popular platforms.",
            color: "bg-secondary-light",
            textColor: "text-secondary"
        }
    ];

    const plans = [
        {
            name: "Starter",
            price: "Free",
            features: [
                "Up to 10 bookings/month",
                "Basic analytics",
                "Email support",
                "Mobile app access",
                "Basic reporting",
                "24/7 support"
            ],
            icon: <Calendar className="w-6 h-6" />,
            popular: false,
            color: "bg-primary-light"
        },
        {
            name: "Professional",
            price: "$5",
            features: [
                "Unlimited bookings",
                "Advanced analytics",
                "Priority support",
                "Custom branding",
                "View top rated places",
                "AI-powered scheduling"
            ],
            icon: <Crown className="w-6 h-6" />,
            popular: true,
            color: "bg-secondary-light"
        },
        {
            name: "Angel Membership",
            price: "$10",
            features: [
                "Unlimited bookings",
                "Designed for Organizations/Family",
                "Priority support",
                "Custom branding",
                "View top rated places",
                "AI-powered scheduling"
            ],
            icon: <BarChart className="w-6 h-6" />,
            popular: false,
            color: "bg-tertiary-light"
        }
    ];

    const teamMembers = [
        {
            name: "Uvindu Amaratunge",
            role: "Leader - Website Backend Developer",
            image: UvinduImage,
            social: {
                linkedin: "linkedin.com/in/uvindu-amaratunga",
            }
        },
        {
            name: "Nishanjali Kamalendran",
            role: "Website Frontend Developer and Marketing",
            image: NishanjaliImage,
            social: {
                linkedin: "linkedin.com/in/nishanjali-kamalendran-b43502293",
                Mail: "nishanjali.kamal~@gmail.com"
            }
        },
        {
            name: "Manoharan Abinath",
            role: "Mobile Frontend Developer",
            image: AbinathImage,
            social: {
                linkedin: "linkedin.com/in/abbeinaath"
            }
        },
        {
            name: "Kavindu Kalhara Weerakoon",
            role: "Mobile Frontend Developer",
            image: KavinduImage,
            social: {
                linkedin: "linkedin.com/in/kavindu-kalhara-weerakoon-049617332"
            }
        },
        {
            name: "Neethila Ransika Silva",
            role: "Mobile Backend Developer",
            image: RansikaImage,
            social: {
                linkedin: "linkedin.com/in/ransikasilva"
            }
        },
        {
            name: "Vibuthi seniya Liyanage",
            role: "Mobile Frontend Developer",
            image: SeniyaImage,
            social: {
                linkedin: "linkedin.com/in/seniya-liyanage01"
            }
        }
    ];

    const handlePlanSelect = (planName) => {
        setSelectedPlan(planName);
        // Smooth scroll to contact form for enterprise plan
        if (planName === 'Enterprise') {
            document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
        }
    };

    const renderStars = (rating) => {
        return [...Array(rating)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
        ));
    };

    return (
        <div className="min-h-screen">
            {/* Navigation */}
            <nav className={`nav-container ${isHeaderVisible ? '' : 'nav-hidden'}`}>
                <div className="nav-content">

                    <button
                        className="mobile-menu"
                        onClick={() => setIsNavOpen(!isNavOpen)}
                        aria-label="Toggle menu"
                    >
                        <span className={`hamburger ${isNavOpen ? 'open' : ''}`}></span>
                    </button>
                    <div className={`nav-links ${isNavOpen ? 'show' : ''}`}>
                        <a href="#features">Features</a>
                        <a href="#team">Team</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#contact">Contact</a>

                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="hero-section">
                <div className="hero-content">
                    <div className="hero-badge">
                        <Zap className="w-4 h-4 mr-2" />
                        <span>New: AI-Powered Scheduling</span>
                    </div>
                    <h1>Transform Your Business with Smart Reservations</h1>
                    <p>Join innovative businesses using SlotZi to streamline bookings, delight customers, and grow their revenue.</p>
                    <div className="hero-buttons">
                        <button className="primary-btn" onClick={() => navigate('/signin')}>
                            Login to View<ChevronRight className="w-4 h-4 ml-2" />
                        </button>
                        <button className="secondary-btn" onClick={() => navigate('/signup')}>
                            Register to Start <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>
                <div className="hero-image">
                    <div className="hero-dashboard"><img src={video}/></div>
                </div>
            </section>


            {/* Features */}
            <section id="features" className="features-section" ref={featuresRef}>
                <div className="section-header">
                    <h2>Why Choose SlotZi</h2>
                    <p>Powerful features that help you manage reservations effortlessly</p>
                </div>
                <div className="features-tabs">
                    <div className="features-nav">
                        {features.map((feature, index) => (
                            <button
                                key={index}
                                className={`feature-tab ${index === activeFeature ? 'active' : ''}`}
                                onClick={() => setActiveFeature(index)}
                            >
                                <div className={`tab-icon ${feature.textColor}`}>
                                    {feature.icon}
                                </div>
                                <span>{feature.title}</span>
                            </button>
                        ))}
                    </div>
                    <div className="features-content">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className={`feature-panel ${index === activeFeature ? 'active' : ''} ${feature.color}`}
                            >
                                <div className="feature-details">
                                    <h3 className={feature.textColor}>{feature.title}</h3>
                                    <p>{feature.description}</p>
                                    <button className={`feature-cta ${feature.textColor}`}>
                                        Learn more <ArrowRight className="w-4 h-4 ml-1" />
                                    </button>
                                </div>
                                <div className="feature-visual">
                                    <div className={`feature-image ${feature.color}`}>
                                        {feature.icon}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section id="team" className="team-section">
                <div className="section-header">
                    <h2>Meet Our Team</h2>
                    <p>The innovative minds behind SlotZi</p>
                </div>
                <div className="team-grid">
                    {teamMembers.map((member, index) => (
                        <div key={index} className="team-card">
                            <div className="member-image">
                                <img src={member.image} alt={member.name} />
                            </div>
                            <div className="member-info">
                                <h3>{member.name}</h3>
                                <span className="member-role">{member.role}</span>
                                <p className="member-bio">{member.bio}</p>
                                <div className="member-social">
                                    {member.social.linkedin && (
                                        <a href={member.social.linkedin} aria-label="LinkedIn">
                                            <Linkedin className="w-5 h-5" />
                                        </a>
                                    )}
                                    {member.social.github && (
                                        <a href={member.social.github} aria-label="GitHub">
                                            <Github className="w-5 h-5" />
                                        </a>
                                    )}

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing */}
            <section id="pricing" className="pricing-section">
                <div className="section-header">
                    <h2>Simple, Transparent Pricing</h2>
                    <p>Choose the perfect plan for your business</p>
                </div>
                <div className="pricing-grid">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`pricing-card ${plan.color} ${plan.popular ? 'popular' : ''} ${
                                selectedPlan === plan.name ? 'selected' : ''
                            }`}
                            onClick={() => handlePlanSelect(plan.name)}
                        >
                            {plan.popular && <div className="popular-badge">Most Popular</div>}
                            <div className="plan-header">
                                {plan.icon}
                                <h3>{plan.name}</h3>
                                <div className="price">
                                    {plan.price}
                                    <span>/month</span>
                                </div>
                            </div>
                            <ul className="plan-features">
                                {plan.features.map((feature, i) => (
                                    <li key={i}>
                                        <Check className="w-5 h-5 text-green-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button className="select-plan-btn">
                                {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials */}
            <section className="testimonials-section">
                <div className="section-header">
                    <h2>Loved by Businesses Worldwide</h2>
                    <p>See what our customers have to say</p>
                </div>
                <div className="testimonial-container">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className={`testimonial-card ${index === activeTestimonial ? 'active' : ''}`}
                        >
                            <img src={testimonial.image} alt={testimonial.name} />
                            <div className="rating">{renderStars(testimonial.rating)}</div>
                            <p className="testimonial-content">"{testimonial.content}"</p>
                            <h4>{testimonial.name}</h4>
                            <span>{testimonial.role}</span>
                        </div>
                    ))}
                </div>
                <div className="testimonial-dots">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === activeTestimonial ? 'active' : ''}`}
                            onClick={() => setActiveTestimonial(index)}
                        />
                    ))}
                </div>
            </section>

            {/* Contact */}
            <section id="contact" className="contact-section">
                <div className="section-header">
                    <h2>Get in Touch</h2>
                    <p>We'd love to hear from you</p>
                </div>
                <div className="contact-container">
                    <div className="contact-info">
                        <div className="contact-card">
                            <h3>Contact Information</h3>
                            <div className="contact-item">
                                <Mail className="contact-icon" />
                                <p>hello@slotzi.com</p>
                            </div>
                            <div className="contact-item">
                                <Phone className="contact-icon" />
                                <p>+94 71 667 2616</p>
                            </div>
                            <div className="contact-item">
                                <MapPin className="contact-icon" />
                                <p>IIT City Office<br />Colombo</p>
                            </div>
                            <div className="contact-social">
                                <a href="#" aria-label="Instagram">
                                    <Instagram className="https://www.instagram.com/slot_zi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" />
                                </a>
                                <a href="#" aria-label="Twitter">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="#" aria-label="LinkedIn">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                    <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
                        <div className="form-grid">
                            <div className="form-group">
                                <label htmlFor="name">Your Name</label>
                                <input type="text" id="name" placeholder="John Smith" required />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Your Email</label>
                                <input type="email" id="email" placeholder="john@example.com" required />
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="inquiry">Inquiry Type</label>
                                <select id="inquiry">
                                    <option value="">Select Inquiry Type</option>
                                    <option value="sales">Sales</option>
                                    <option value="support">Support</option>
                                    <option value="partnership">Partnership</option>
                                </select>
                            </div>
                            <div className="form-group full-width">
                                <label htmlFor="message">Your Message</label>
                                <textarea id="message" placeholder="Tell us how we can help you..." required></textarea>
                            </div>
                        </div>
                        <button type="submit" className="submit-btn">
                            Send Message
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </form>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-logo">
                        <div className="logo-icon">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <span>SlotZi</span>
                    </div>
                    <div className="footer-links">
                        <div className="footer-column">
                            <h4>Product</h4>
                            <a href="#features">Features</a>
                            <a href="#pricing">Pricing</a>
                            <a href="#testimonials">Testimonials</a>
                            <a href="#team">Team</a>
                        </div>
                        <div className="footer-column">
                            <h4>Company</h4>
                            <a href="/about">About</a>
                            <a href="#contact">Contact</a>
                            <a href="/privacy">Privacy</a>
                            <a href="/terms">Terms</a>
                        </div>
                        <div className="footer-column">
                            <h4>Resources</h4>
                            <a href="/blog">Blog</a>
                            <a href="/help">Help Center</a>
                            <a href="/status">Status</a>
                        </div>
                        <div className="footer-column">
                            <h4>Follow Us</h4>
                            <div className="social-links">
                                <a href="https://www.instagram.com/slot_zi?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a href="https://twitter.com/slotzi" target="_blank" rel="noopener noreferrer">
                                    <Twitter className="w-5 h-5" />
                                </a>
                                <a href="https://linkedin.com/company/slotzi" target="_blank" rel="noopener noreferrer">
                                    <Linkedin className="w-5 h-5" />
                                </a>
                            </div>
                            <div className="newsletter">
                                <h4>Subscribe to our newsletter</h4>
                                <div className="newsletter-form">
                                    <input type="email" placeholder="Your email" />
                                    <button type="submit">
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; 2025 SlotZi. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default Home;
