import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight, Users, Building2, Calendar, Star, Clock, Shield, 
  BarChart as ChartBar, Settings, Zap, Facebook, Twitter, 
  Instagram, Mail, Phone, Award, CheckCircle, MapPin
} from 'lucide-react';
import "../style/Home.css";

const Home = () => {
    const navigate = useNavigate();
  // Data for stats section
  const stats = [
    { icon: Users, value: "10,000+", label: "Active Users" },
    { icon: Building2, value: "2,500+", label: "Businesses" },
    { icon: Calendar, value: "1.2M+", label: "Bookings Monthly" }
  ];
  
  const handleUserClick = () => {
    navigate('/users');
  };

  const handleBusinessClick = () => {
    navigate('/business-choice'); // Navigate to BusinessChoice page
  };


  

  // Data for features section
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Intelligent booking system that adapts to your business needs and optimizes your calendar."
    },
    {
      icon: Clock,
      title: "Time Management",
      description: "Reduce no-shows with automated reminders and seamless rescheduling options."
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Enterprise-grade security ensures your data and your customers' information stays protected."
    },
    {
      icon: ChartBar,
      title: "Detailed Analytics",
      description: "Gain insights into your business performance with comprehensive reporting tools."
    },
    {
      icon: Settings,
      title: "Customizable",
      description: "Tailor the platform to match your brand and specific business requirements."
    },
    {
      icon: Zap,
      title: "Integration Ready",
      description: "Connects with your existing tools including Google Calendar, Outlook, and CRM systems."
    }
  ];

  // Data for values section
  const values = [
    {
      icon: CheckCircle,
      title: "Customer Success",
      description: "We're dedicated to helping your business thrive with our tools and support."
    },
    {
      icon: Shield,
      title: "Reliability",
      description: "Built with enterprise-grade security and 99.9% uptime for businesses of all sizes."
    },
    {
      icon: Award,
      title: "Innovation",
      description: "Constantly evolving our platform with the latest technologies and best practices."
    }
  ];

  // Data for steps section
  const steps = [
    {
      icon: Settings,
      title: "Setup Your Account",
      description: "Create your profile, customize your booking preferences, and set your availability in minutes."
    },
    {
      icon: Calendar,
      title: "Share Your Booking Link",
      description: "Add your personalized booking page to your website or share directly with customers."
    },
    {
      icon: CheckCircle,
      title: "Start Accepting Bookings",
      description: "Watch as appointments automatically flow into your calendar with zero double-bookings."
    }
  ];

  return (
    <div className="container">
      

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="main"
      >
        {/* Hero Section */}
        <div className="hero">
          <div className="grid"></div>
          <div className="wrapper padded">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="center"
            >
              <span className="badge">
                Revolutionizing Business Management
              </span>
              <h1 className="title">
                Smart Scheduling for<br />Modern Businesses
              </h1>
              <p className="subtitle">
                Transform your business operations with SlotZi's intelligent reservation platform. 
                Streamline bookings, reduce no-shows, and delight your customers.
              </p>
              <div className="buttons">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="primary"
                  onClick={handleUserClick}
                >
                  <Users className="icon" />
                  For Users
                  <ArrowRight className="icon" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="secondary"
                  onClick={handleBusinessClick}
                >
                  <Building2 className="icon" />
                  For Business
                  <ArrowRight className="icon" />
                </motion.button>
              </div>
              <div className="stats">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="card"
                  >
                    <stat.icon className="staticon" />
                    <h3 className="statvalue">{stat.value}</h3>
                    <p className="statlabel">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Features Section */}
        <div className="features">
          <div className="wrapper">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="center"
            >
              <span className="badge">
                Why Choose SlotZi
              </span>
              <h2 className="heading">
                Everything You Need to Succeed
              </h2>
              <p className="text">
                Experience the future of business reservations with our comprehensive platform 
                designed to help your business thrive in the digital age.
              </p>
            </motion.div>

            <div className="grid3">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="featurecard"
                >
                  <div className="iconbox">
                    <feature.icon className="featureicon" />
                  </div>
                  <h3 className="featuretitle">{feature.title}</h3>
                  <p className="featuredesc">{feature.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Testimonial Section */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="testimonial"
            >
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="star" />
                ))}
              </div>
              <p className="quote">
                "SlotZi has transformed how we handle appointments. Our no-show rate dropped by 60%, 
                and customer satisfaction is at an all-time high!"
              </p>
              <div className="author">
                <h4 className="name">Sarah Johnson</h4>
                <p className="role">CEO, Wellness Center</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta">
          <div className="wrapper">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="center"
            >
              <h2 className="ctaheading">
                Ready to Transform Your Business?
              </h2>
              <p className="ctasubtext">
                Join thousands of businesses already using SlotZi to streamline their operations.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ctabutton"
              >
                Start Free Trial
                <ArrowRight className="icon" />
              </motion.button>
            </motion.div>
          </div>
        </div>

        {/* About Section */}
        <div className="about">
          <div className="wrapper">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="center"
            >
              <h1 className="heading">About SlotZi</h1>
              <p className="subheading">
                We're revolutionizing the way businesses handle reservations, making it simpler and more efficient for everyone involved.
              </p>
            </motion.div>

            <div className="values">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="center"
                >
                  <div className="iconwrap">
                    <value.icon className="valueicon" />
                  </div>
                  <h3 className="valuetitle">{value.title}</h3>
                  <p className="valuedesc">{value.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mission"
            >
              <h2 className="missiontitle">Our Mission</h2>
              <p className="missiontext">
                To empower businesses with innovative scheduling solutions that save time, reduce complexity, and enhance the customer experience. We believe in making reservation management accessible, efficient, and stress-free for everyone.
              </p>
            </motion.div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="howworks">
          <div className="wrapper">

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="center"
            >
              <span className="badge">
                Simple & Efficient
              </span>
              <h1 className="heading">How SlotZi Works</h1>
              <p className="subheading">
                Discover how our platform streamlines your business scheduling in three simple steps
              </p>
            </motion.div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="steps">
          <div className="wrapper">
            <div className="stepsrow">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="stepwrap"
                >
                  <div className="stepcard">
                    <div className="stepicon">
                      <step.icon className="icon" />
                    </div>
                    <h3 className="steptitle">{step.title}</h3>
                    <p className="stepdesc">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="connector" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact">
          <div className="wrapper">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="center"
            >
              <h1 className="heading">Contact Us</h1>
              <p className="subheading">
                Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
              </p>
            </motion.div>

            <div className="contactgrid">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="formcard"
              >
                <h2 className="formtitle">Get in Touch</h2>
                <form className="form">
                  <div className="field">
                    <label htmlFor="name" className="label">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      className="input"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email" className="label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className="input"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="message" className="label">Message</label>
                    <textarea
                      id="message"
                      rows="4"
                      className="textarea"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="submit"
                  >
                    Send Message
                  </motion.button>
                </form>
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="infocard"
              >
                <h2 className="infotitle">Contact Information</h2>
                <div className="infolist">
                  <div className="infoitem">
                    <Mail className="infoicon" />
                    <div>
                      <h3 className="itemtitle">Email</h3>
                      <p className="itemtext">support@slotzi.com</p>
                    </div>
                  </div>
                  <div className="infoitem">
                    <Phone className="infoicon" />
                    <div>
                      <h3 className="itemtitle">Phone</h3>
                      <p className="itemtext">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="infoitem">
                    <MapPin className="infoicon" />
                    <div>
                    <h3 className="itemtitle">Location</h3>
                      <p className="itemtext">123 Business Ave, Suite 200<br />San Francisco, CA 94107</p>
                    </div>
                  </div>
                </div>
                <div className="social">
                  <h3 className="socialtitle">Follow Us</h3>
                  <div className="socialicons">
                    <a href="#" className="sociallink">
                      <Facebook className="socialicon" />
                    </a>
                    <a href="#" className="sociallink">
                      <Twitter className="socialicon" />
                    </a>
                    <a href="#" className="sociallink">
                      <Instagram className="socialicon" />
                    </a>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="wrapper">
            <div className="footergrid">
              <div className="footercol">
                <h3 className="footertitle">SlotZi</h3>
                <p className="footertext">The intelligent scheduling platform for modern businesses.</p>
                <div className="footersocial">
                  <a href="#" className="footerlink">
                    <Facebook className="footericon" />
                  </a>
                  <a href="#" className="footerlink">
                    <Twitter className="footericon" />
                  </a>
                  <a href="#" className="footerlink">
                    <Instagram className="footericon" />
                  </a>
                </div>
              </div>
              <div className="footercol">
                <h3 className="footertitle">Product</h3>
                <ul className="footermenu">
                  <li><Link to="/features" className="footerlink">Features</Link></li>
                  <li><Link to="/pricing" className="footerlink">Pricing</Link></li>
                  <li><Link to="/testimonials" className="footerlink">Testimonials</Link></li>
                  <li><Link to="/integrations" className="footerlink">Integrations</Link></li>
                </ul>
              </div>
              <div className="footercol">
                <h3 className="footertitle">Company</h3>
                <ul className="footermenu">
                  <li><Link to="/about" className="footerlink">About Us</Link></li>
                  <li><Link to="/careers" className="footerlink">Careers</Link></li>
                  <li><Link to="/blog" className="footerlink">Blog</Link></li>
                  <li><Link to="/contact" className="footerlink">Contact</Link></li>
                </ul>
              </div>
              <div className="footercol">
                <h3 className="footertitle">Support</h3>
                <ul className="footermenu">
                  <li><Link to="/help" className="footerlink">Help Center</Link></li>
                  <li><Link to="/faq" className="footerlink">FAQ</Link></li>
                  <li><Link to="/privacy" className="footerlink">Privacy Policy</Link></li>
                  <li><Link to="/terms" className="footerlink">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
            <div className="copyright">
              <p className="copyrighttext">© {new Date().getFullYear()} SlotZi. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};



export default Home;