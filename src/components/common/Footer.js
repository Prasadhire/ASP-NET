import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer bg-dark text-light">
      <Container>
        <Row className="py-5">
          <Col lg={4} md={6} className="mb-4">
            <div className="footer-brand mb-3">
              <i className="fas fa-bus me-2 text-primary"></i>
              <span className="h5 mb-0">TravelBus</span>
            </div>
            <p className="text-muted">
              Your trusted partner for comfortable and safe bus travels across the country. 
              Book your tickets with ease and travel with confidence.
            </p>
            <div className="social-links">
              <a href="#" className="text-light me-3">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" className="text-light me-3">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" className="text-light me-3">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" className="text-light">
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </Col>
          
          <Col lg={2} md={6} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/search" className="text-muted text-decoration-none">Book Tickets</Link>
              </li>
              <li className="mb-2">
                <Link to="/my-bookings" className="text-muted text-decoration-none">My Bookings</Link>
              </li>
              <li className="mb-2">
                <a href="#features" className="text-muted text-decoration-none">Features</a>
              </li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Support</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="fas fa-headset me-2 text-primary"></i>
                  Help Center
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="fas fa-file-contract me-2 text-primary"></i>
                  Terms & Conditions
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="fas fa-shield-alt me-2 text-primary"></i>
                  Privacy Policy
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">
                  <i className="fas fa-question-circle me-2 text-primary"></i>
                  FAQ
                </a>
              </li>
            </ul>
          </Col>
          
          <Col lg={3} md={6} className="mb-4">
            <h6 className="text-uppercase fw-bold mb-3">Contact Info</h6>
            <div className="contact-info">
              <div className="mb-3">
                <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                <span className="text-muted">123 Travel Street, City, Country</span>
              </div>
              <div className="mb-3">
                <i className="fas fa-phone me-2 text-primary"></i>
                <span className="text-muted">+1 234 567 8900</span>
              </div>
              <div className="mb-3">
                <i className="fas fa-envelope me-2 text-primary"></i>
                <span className="text-muted">support@travelbus.com</span>
              </div>
              <div>
                <i className="fas fa-clock me-2 text-primary"></i>
                <span className="text-muted">24/7 Customer Support</span>
              </div>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-muted mb-0">
              &copy; 2024 TravelBus Management System. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-end">
            <p className="text-muted mb-0">
              Made with <i className="fas fa-heart text-danger"></i> for travelers
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;