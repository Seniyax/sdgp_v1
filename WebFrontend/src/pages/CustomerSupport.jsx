import React, { useState } from 'react';
import "../style/CustomerSupport.css";

const CustomerSupport = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const supportCategories = [
    {
      id: 1,
      title: 'Account Issues',
      icon: '👤',
      faqs: [
        { question: 'How do I reset my password?', answer: 'You can reset your password by clicking on the "Forgot Password" link on the login page and following the instructions sent to your email.' },
        { question: 'How do I update my profile information?', answer: 'Go to "My Account" > "Profile Settings" to update your personal information.' },
        { question: 'Why am I unable to log in?', answer: 'This could be due to incorrect credentials, account suspension, or technical issues. Try resetting your password, and if the issue persists, contact our support team.' }
      ]
    },
    {
      id: 2,
      title: 'Billing & Payments',
      icon: '💳',
      faqs: [
        { question: 'When will I be charged?', answer: 'You will be charged immediately upon subscription. Subsequent charges will occur on the same date each month or year, depending on your billing cycle.' },
        { question: 'How do I update my payment method?', answer: 'Go to "My Account" > "Billing" > "Payment Methods" to add or update your payment information.' },
        { question: 'Can I get a refund?', answer: 'Refund policies vary by product. Please review our refund policy or contact customer support for specific cases.' }
      ]
    },
    {
      id: 3,
      title: 'Technical Support',
      icon: '🔧',
      faqs: [
        { question: 'The application is running slow. What should I do?', answer: 'Try clearing your browser cache, restarting the application, or checking your internet connection. If the problem persists, contact our technical team.' },
        { question: 'How do I troubleshoot connection issues?', answer: 'Check your internet connection, try using a different browser, or restart your device. For persistent issues, please contact us with your network details.' },
        { question: 'Is there a mobile app available?', answer: 'Yes, our mobile app is available for download on both iOS and Android platforms.' }
      ]
    }
  ];

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your server
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setShowContactForm(false);
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const filteredCategories = supportCategories.map(category => {
    const filteredFaqs = category.faqs.filter(
      faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
             faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...category, faqs: filteredFaqs };
  }).filter(category => category.faqs.length > 0 || category.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="customer-support">
      <header className="header">
        <h1>How can we help you?</h1>
        <div className="search-container">
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button className="search-button">Search</button>
        </div>
      </header>

      <div className="content">
        <div className="categories">
          {filteredCategories.length > 0 ? (
            filteredCategories.map(category => (
              <div key={category.id} className="category-block">
                <div 
                  className={`category-header ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <span className="category-icon">{category.icon}</span>
                  <h2>{category.title}</h2>
                  <span className="toggle-icon">{selectedCategory === category.id ? '−' : '+'}</span>
                </div>
                {selectedCategory === category.id && (
                  <div className="faq-container">
                    {category.faqs.map((faq, index) => (
                      <div key={index} className="faq-item">
                        <h3>{faq.question}</h3>
                        <p>{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="no-results">
              <p>No results found for "{searchQuery}". Please try another search or contact us directly.</p>
            </div>
          )}
        </div>

        <div className="contact-section">
          <h2>Still need help?</h2>
          <button 
            className="contact-button"
            onClick={() => setShowContactForm(!showContactForm)}
          >
            Contact Support
          </button>
        </div>

        {showContactForm && (
          <div className="form-overlay">
            <div className="contact-form">
              <button className="close-button" onClick={() => setShowContactForm(false)}>×</button>
              {!isSubmitted ? (
                <>
                  <h2>Contact Our Support Team</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="name">Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="message">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <button type="submit" className="submit-button">Submit</button>
                  </form>
                </>
              ) : (
                <div className="success-message">
                  <div className="check-icon">✓</div>
                  <h2>Thank you!</h2>
                  <p>Your message has been sent. We'll get back to you shortly.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <footer className="footer">
        <div className="footer-links">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Contact Us</a>
        </div>
        <p>© 2025 Your Company. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default CustomerSupport;