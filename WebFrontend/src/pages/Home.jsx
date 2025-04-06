/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
import video from "../assets/video.mp4";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Users,
  Building2,
  Calendar,
  Star,
  Clock,
  Shield,
  BarChart as ChartBar,
  Settings,
  Zap,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  Award,
  CheckCircle,
  MapPin,
  HelpCircle,
} from "lucide-react";
import "../style/Home.css";
import Swal from "sweetalert2";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setUser(JSON.parse(sessionStorage.getItem("user")));
  }, []);

  // Data for stats section
  const stats = [
    { icon: Users, value: "10,000+", label: "Active Users" },
    { icon: Building2, value: "2,500+", label: "Businesses" },
    { icon: Calendar, value: "1.2M+", label: "Bookings Monthly" },
  ];

  const handleNavigation = (path) => {
    if (user) {
      navigate(path);
    } else {
      Swal.fire({
        title: "Not Signed In",
        text: "Please sign in or sign up to continue.",
        icon: "warning",
        confirmButtonText: "Okay",
      }).then(() => {
        navigate("/sign-in");
      });
    }
  };

  const handleContactClick = () => {
    navigate("/customer-support"); // Navigate to CustomerSupport page
  };

  // Data for features section
  const features = [
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description:
        "Intelligent booking system that adapts to your business needs and optimizes your calendar.",
    },
    {
      icon: Clock,
      title: "Time Management",
      description:
        "Reduce no-shows with automated reminders and seamless rescheduling options.",
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description:
        "Enterprise-grade security ensures your data and your customers' information stays protected.",
    },
    {
      icon: ChartBar,
      title: "Detailed Analytics",
      description:
        "Gain insights into your business performance with comprehensive reporting tools.",
    },
    {
      icon: Settings,
      title: "Customizable",
      description:
        "Tailor the platform to match your brand and specific business requirements.",
    },
    {
      icon: Zap,
      title: "Integration Ready",
      description:
        "Connects with your existing tools including Google Calendar, Outlook, and CRM systems.",
    },
  ];

  // Data for values section
  const values = [
    {
      icon: CheckCircle,
      title: "Customer Success",
      description:
        "We're dedicated to helping your business thrive with our tools and support.",
    },
    {
      icon: Shield,
      title: "Reliability",
      description:
        "Built with enterprise-grade security and 99.9% uptime for businesses of all sizes.",
    },
    {
      icon: Award,
      title: "Innovation",
      description:
        "Constantly evolving our platform with the latest technologies and best practices.",
    },
  ];

  // Data for steps section
  const steps = [
    {
      icon: Settings,
      title: "Setup Your Account",
      description:
        "Create your profile, customize your booking preferences, and set your availability in minutes.",
    },
    {
      icon: Calendar,
      title: "Share Your Booking Link",
      description:
        "Add your personalized booking page to your website or share directly with customers.",
    },
    {
      icon: CheckCircle,
      title: "Start Accepting Bookings",
      description:
        "Watch as appointments automatically flow into your calendar with zero double-bookings.",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      content: e.target.message.value,
    };

    try {
      const response = await fetch("/api/email/contact-dev", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }
      console.log("Success:", data);
      await Swal.fire({
        title: "Support Email Sent",
        text: "Your message has been sent. We'll get back to you soon.",
        icon: "success",
        confirmButtonText: "Okay",
      });
      e.target.reset();
    } catch (error) {
      console.error("Error submitting the form:", error.message);
      Swal.fire({
        title: "Error",
        text:
          error.message ||
          "There was an error sending your message. Please try again later.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
          <video className="hero-video" autoPlay loop muted playsInline>
            <source src={video} type="video/mp4" />
          </video>
          <div className="hero-overlay"></div>
          <div className="wrapper padded">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="center"
            >
              <span className="badge">Revolutionizing Time Management</span>
              <h1 className="title">
                Smart Scheduling for
                <br />
                Modern Businesses
              </h1>
              <p className="subtitle">
                Transform your business operations with SlotZi&apos;s
                intelligent reservation platform. Streamline bookings, reduce
                no-shows, and delight your customers.
              </p>
              <div className="buttons">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="secondary"
                  onClick={() => handleNavigation("/business-registration")}
                >
                  <Users className="icon" />
                  Register Business
                  <ArrowRight className="icon" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="secondary"
                  onClick={() => handleNavigation("/business-join")}
                >
                  <Building2 className="icon" />
                  Join Business
                  <ArrowRight className="icon" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="tertiary"
                  onClick={() => handleNavigation("/manage-business")}
                >
                  <HelpCircle className="icon" />
                  Manage Business
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
              <span className="badge">Why Choose SlotZi</span>
              <h2 className="heading">Everything You Need to Succeed</h2>
              <p className="text">
                Experience the future of business reservations with our
                comprehensive platform designed to help your business thrive in
                the digital age.
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
                &quot;SlotZi has transformed how we handle appointments. Our
                no-show rate dropped by 60%, and customer satisfaction is at an
                all-time high!&quot;
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
              <h2 className="ctaheading">Ready to Transform Your Business?</h2>
              <p className="ctasubtext">
                Join thousands of businesses already using SlotZi to streamline
                their operations.
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

        {/* Subscription Plans Section */}
        <div className="subscription">
          <div className="wrapper">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              className="center"
            >
              <span className="badge">Pick Your Plan</span>
              <h2 className="heading">Simple Pricing for Every Business</h2>
              <p className="subheading">
                Choose the plan that works best for your business needs. No
                hidden fees, cancel anytime.
              </p>
            </motion.div>

            <div className="plans">
              {/* Free Plan */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="plan free"
              >
                <div className="planBadge">
                  <span>Starter</span>
                </div>
                <h3 className="planTitle">Free</h3>
                <div className="planPrice">
                  <span className="price">$0</span>
                  <span className="period">/month</span>
                </div>
                <p className="planDescription">
                  Perfect for individuals or small businesses just getting
                  started.
                </p>
                <ul className="planFeatures">
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>Up to 5 bookings per month</span>
                  </li>
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>Basic calendar integrations</span>
                  </li>
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>Email notifications</span>
                  </li>
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>Basic customization options</span>
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="planButton"
                  onClick={() => handleNavigation("/business-registration")}
                >
                  Get Started
                  <ArrowRight className="icon" />
                </motion.button>
              </motion.div>

              {/* Monthly Plan */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="plan monthly popular"
              >
                <div className="planBadge popular">
                  <span>Most Popular</span>
                </div>
                <h3 className="planTitle">Professional</h3>
                <div className="planPrice">
                  <span className="price">Rs.399</span>
                  <span className="period">/month</span>
                </div>
                <p className="planDescription">
                  For growing businesses that need more advanced features.
                </p>
                <ul className="planFeatures">
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>Unlimited bookings</span>
                  </li>
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>Advanced calendar integrations</span>
                  </li>
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>SMS notifications</span>
                  </li>
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>Custom branding</span>
                  </li>
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>Priority support</span>
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="planButton"
                  onClick={() => handleNavigation("/business-registration")}
                >
                  Start Monthly
                  <ArrowRight className="icon" />
                </motion.button>
              </motion.div>

              {/* Yearly Plan */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="plan yearly"
              >
                <div className="planBadge">
                  <span>Best Value</span>
                </div>
                <h3 className="planTitle">Enterprise</h3>
                <div className="planPrice">
                  <span className="price">Rs.3999</span>
                  <span className="period">/year</span>
                </div>
                <div className="savings">
                  <span>Save Rs.</span>789
                </div>
                <p className="planDescription">
                  Complete solution for established businesses and
                  organizations.
                </p>
                <ul className="planFeatures">
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>Everything in Professional</span>
                  </li>
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>Multi-location support</span>
                  </li>
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>Multiple Bookings at a time</span>
                  </li>
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>Unlock discounts</span>
                  </li>
                  <li>
                    <CheckCircle className="featureIcon" />
                    <span>Star points earned</span>
                  </li>
                </ul>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="planButton"
                  onClick={() => handleNavigation("/business-registration")}
                >
                  Start Yearly
                  <ArrowRight className="icon" />
                </motion.button>
              </motion.div>
            </div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="enterpriseOffer"
            >
              <h3>Need a Custom Solution?</h3>
              <p>
                Contact our sales team for a tailored enterprise package that
                fits your specific needs.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="enterpriseButton"
                onClick={handleContactClick}
              >
                Contact Sales
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
                We&apos;re revolutionizing the way businesses handle
                reservations, making it simpler and more efficient for everyone
                involved.
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
                To empower businesses with innovative scheduling solutions that
                save time, reduce complexity, and enhance the customer
                experience. We believe in making reservation management
                accessible, efficient, and stress-free for everyone.
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
              <span className="badge">Simple & Efficient</span>
              <h1 className="heading">How SlotZi Works</h1>
              <p className="subheading">
                Discover how our platform streamlines your business scheduling
                in three simple steps
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
                  className={`stepwrap ${index === 2 ? "last" : ""}`}
                >
                  <div className="stepcard">
                    <div className="stepicon">
                      <step.icon className="icon" />
                    </div>
                    <h3 className="steptitle">{step.title}</h3>
                    <p className="stepdesc">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && <div className="connector" />}
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
                Have questions? We&apos;re here to help. Reach out to our team
                and we&apos;ll get back to you as soon as possible.
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
                <form className="form" onSubmit={handleSubmit}>
                  <div className="field">
                    <label htmlFor="name" className="label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="email" className="label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="input"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="message" className="label">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span>
                        Sending<span className="dot-animation"></span>
                      </span>
                    ) : (
                      "Send Message"
                    )}
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
                      <p className="itemtext">+94 (71) 667 2617</p>
                    </div>
                  </div>
                  <div className="infoitem">
                    <MapPin className="infoicon" />
                    <div>
                      <h3 className="itemtitle">Location</h3>
                      <p className="itemtext">
                        IIT CIty Offcie
                        <br />
                        Galle Road, Colombo
                      </p>
                    </div>
                  </div>
                </div>
                <div className="social">
                  <h3 className="socialtitle">Follow Us</h3>
                  <div className="socialicons">
                    <a
                      href="https://www.instagram.com/slot_zi?igsh=aDIxa3hjbjlzcHo0&utm_source=qr"
                      className="sociallink"
                    >
                      <Facebook className="socialicon" />
                    </a>
                    <a
                      href="https://www.instagram.com/slot_zi?igsh=aDIxa3hjbjlzcHo0&utm_source=qr"
                      className="sociallink"
                    >
                      <Twitter className="socialicon" />
                    </a>
                    <a
                      href="https://www.instagram.com/slot_zi?igsh=aDIxa3hjbjlzcHo0&utm_source=qr"
                      className="sociallink"
                    >
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
                <p className="footertext">
                  The intelligent scheduling platform for modern businesses.
                </p>
                <div className="footersocial">
                  <a
                    href="https://www.instagram.com/slot_zi?igsh=aDIxa3hjbjlzcHo0&utm_source=qr"
                    className="footerlink"
                  >
                    <Facebook className="footericon" />
                  </a>
                  <a
                    href="https://www.instagram.com/slot_zi?igsh=aDIxa3hjbjlzcHo0&utm_source=qr"
                    className="footerlink"
                  >
                    <Twitter className="footericon" />
                  </a>
                  <a
                    href="https://www.instagram.com/slot_zi?igsh=aDIxa3hjbjlzcHo0&utm_source=qr"
                    className="footerlink"
                  >
                    <Instagram className="footericon" />
                  </a>
                </div>
              </div>
              <div className="footercol">
                <h3 className="footertitle">Product</h3>
                <ul className="footermenu">
                  <li>
                    <Link to="/features" className="footerlink">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link to="/pricing" className="footerlink">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link to="/testimonials" className="footerlink">
                      Testimonials
                    </Link>
                  </li>
                  <li>
                    <Link to="/integrations" className="footerlink">
                      Integrations
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="footercol">
                <h3 className="footertitle">Company</h3>
                <ul className="footermenu">
                  <li>
                    <Link
                      to="https://slotzi-marketing.vercel.app/#team"
                      className="footerlink"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link to="/careers" className="footerlink">
                      Careers
                    </Link>
                  </li>
                  <li>
                    <Link to="/blog" className="footerlink">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link to="/customer-support" className="footerlink">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="footercol">
                <h3 className="footertitle">Support</h3>
                <ul className="footermenu">
                  <li>
                    <Link to="/customer-support" className="footerlink">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link to="/faq" className="footerlink">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="https://slotzi-marketing.vercel.app/privacy-policy"
                      className="footerlink"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="https://slotzi-marketing.vercel.app/terms"
                      className="footerlink"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="copyright">
              <p className="copyrighttext">
                © {new Date().getFullYear()} SlotZi. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </motion.div>
    </div>
  );
};

export default Home;
