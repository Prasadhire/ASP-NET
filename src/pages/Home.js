import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import SearchBox from '../components/common/SearchBox';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center min-vh-80">
            <Col lg={6}>
              <div className="hero-content">
                <h1 className="hero-title">
                  Travel Smarter, <span className="text-primary">Reach Further</span>
                </h1>
                <p className="hero-subtitle">
                  Book your bus tickets online with ease. Choose from hundreds of routes, 
                  compare prices, and travel comfortably across the country.
                </p>
                
                {/* Search Box */}
                <div className="search-container">
                  <SearchBox />
                </div>

                {/* Stats */}
                <Row className="stats-row">
                  <Col xs={4}>
                    <div className="stat-item">
                      <h3>500+</h3>
                      <p>Daily Buses</p>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="stat-item">
                      <h3>50+</h3>
                      <p>Cities</p>
                    </div>
                  </Col>
                  <Col xs={4}>
                    <div className="stat-item">
                      <h3>10K+</h3>
                      <p>Happy Travelers</p>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col lg={6}>
              <div className="hero-image">
                <div className="bus-illustration">
                  <div className="bus-body">
                    <div className="bus-windows">
                      <div className="window"></div>
                      <div className="window"></div>
                      <div className="window"></div>
                    </div>
                  </div>
                  <div className="road"></div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section py-5">
        <Container>
          <Row className="text-center mb-5">
            <Col>
              <h2 className="section-title">Why Choose Us?</h2>
              <p className="section-subtitle">Experience the best in bus travel</p>
            </Col>
          </Row>
          <Row>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-shield-alt"></i>
                  </div>
                  <Card.Title>Safe Travel</Card.Title>
                  <Card.Text>
                    Your safety is our priority. All buses are regularly sanitized and maintained.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-tags"></i>
                  </div>
                  <Card.Title>Best Prices</Card.Title>
                  <Card.Text>
                    Get the best deals and discounts on bus tickets across all routes.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="feature-card h-100">
                <Card.Body className="text-center">
                  <div className="feature-icon mb-3">
                    <i className="fas fa-headset"></i>
                  </div>
                  <Card.Title>24/7 Support</Card.Title>
                  <Card.Text>
                    Our customer support team is available round the clock to help you.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-primary text-white">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h3>Ready to Start Your Journey?</h3>
              <p className="mb-0">Book your bus ticket now and travel with comfort and convenience.</p>
            </Col>
            <Col md={4} className="text-end">
              <Button 
                as={Link} 
                to="/search" 
                variant="light" 
                size="lg"
                className="cta-button"
              >
                Book Now
              </Button>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
}

export default Home;