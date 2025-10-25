import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './SearchBox.css';

function SearchBox() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (source && destination) {
      const params = new URLSearchParams({
        source: encodeURIComponent(source),
        destination: encodeURIComponent(destination),
        date: travelDate || new Date().toISOString().split('T')[0]
      });
      navigate(`/search?${params.toString()}`);
    }
  };

  const popularRoutes = [
    { from: 'Surat', to: 'Mumbai' },
    { from: 'Mumbai', to: 'Pune' },
    { from: 'Delhi', to: 'Jaipur' },
    { from: 'Bangalore', to: 'Chennai' }
  ];

  const handlePopularRoute = (from, to) => {
    setSource(from);
    setDestination(to);
  };

  return (
    <Card className="search-box-card">
      <Card.Body>
        <Form onSubmit={handleSearch}>
          <Row className="g-3">
            <Col md={3}>
              <Form.Group>
                <Form.Label>From</Form.Label>
                <Form.Control
                  type="text"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="Enter source city"
                  required
                  className="search-input"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>To</Form.Label>
                <Form.Control
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination city"
                  required
                  className="search-input"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>Travel Date</Form.Label>
                <Form.Control
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="search-input"
                />
              </Form.Group>
            </Col>
            <Col md={3}>
              <div className="d-flex align-items-end h-100">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg" 
                  className="w-100 search-button"
                >
                  Search Buses
                </Button>
              </div>
            </Col>
          </Row>
        </Form>

        {/* Popular Routes */}
        <div className="popular-routes mt-4">
          <h6 className="text-muted mb-3">Popular Routes:</h6>
          <div className="d-flex flex-wrap gap-2">
            {popularRoutes.map((route, index) => (
              <Button
                key={index}
                variant="outline-primary"
                size="sm"
                className="popular-route-btn"
                onClick={() => handlePopularRoute(route.from, route.to)}
              >
                {route.from} → {route.to}
              </Button>
            ))}
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

export default SearchBox;