import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Spinner, Alert, Badge } from 'react-bootstrap';
import { busAPI } from '../services/api';
import { format } from 'date-fns';
import './SearchResults.css';

function SearchResults() {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  const searchParams = new URLSearchParams(location.search);
  const source = searchParams.get('source');
  const destination = searchParams.get('destination');
  const date = searchParams.get('date');

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const response = await busAPI.searchBuses(source, destination);
        console.log('API Response:', response.data);
        setBuses(response.data);
      } catch (err) {
        setError('Failed to fetch buses. Please try again.');
        console.error('Error fetching buses:', err);
      } finally {
        setLoading(false);
      }
    };

    if (source && destination) {
      fetchBuses();
    }
  }, [source, destination]);

  const handleBook = (busId) => {
    const params = new URLSearchParams({
      source,
      destination,
      date: date || new Date().toISOString().split('T')[0]
    });
    navigate(`/book/${busId}?${params.toString()}`);
  };

  const getBusTypeColor = (type) => {
    switch (type?.toLowerCase()) {
      case 'ac': return 'success';
      case 'non-ac': return 'secondary';
      case 'sleeper': return 'info';
      default: return 'primary';
    }
  };

  const calculateFare = (bus) => {
    // Simple fare calculation based on bus type
    let baseFare = 500;
    if (bus.type?.toLowerCase() === 'ac') baseFare = 800;
    if (bus.type?.toLowerCase() === 'sleeper') baseFare = 1000;
    return baseFare;
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-3">Searching for the best buses...</p>
      </Container>
    );
  }

  return (
    <Container className="search-results-page mt-4">
      {/* Search Header */}
      <div className="search-header mb-4">
        <h2>Available Buses</h2>
        <p className="lead">
          From <strong className="text-primary">{source}</strong> 
          <i className="fas fa-arrow-right mx-3 text-muted"></i>
          To <strong className="text-primary">{destination}</strong>
          {date && (
            <span className="ms-3">
              on <strong>{format(new Date(date), 'MMM dd, yyyy')}</strong>
            </span>
          )}
        </p>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      )}

      {buses.length === 0 && !loading ? (
        <Alert variant="warning" className="text-center">
          <i className="fas fa-bus-slash me-2"></i>
          No buses found for the selected route. Please try different cities.
        </Alert>
      ) : (
        buses.map((bus) => (
          <Card key={bus.busID} className="mb-4 bus-card shadow-sm">
            <Card.Body>
              <Row className="align-items-center">
                <Col md={8}>
                  <div className="d-flex align-items-center mb-3">
                    <div className="bus-icon me-3">
                      <i className="fas fa-bus text-primary"></i>
                    </div>
                    <div>
                      <h5 className="mb-1">{bus.busName}</h5>
                      <div className="d-flex align-items-center gap-3">
                        <Badge bg={getBusTypeColor(bus.type)} className="me-2">
                          {bus.type || 'Standard'}
                        </Badge>
                        <small className="text-muted">
                          <i className="fas fa-bus me-1"></i>
                          {bus.busNumber}
                        </small>
                      </div>
                    </div>
                  </div>

                  <Row className="bus-details">
                    <Col sm={6}>
                      <div className="detail-item">
                        <i className="fas fa-chair text-muted me-2"></i>
                        <span>Seats: {bus.totalSeats - (bus.bookedSeats || 0)}/{bus.totalSeats}</span>
                      </div>
                    </Col>
                    <Col sm={6}>
                      <div className="detail-item">
                        <i className="fas fa-route text-muted me-2"></i>
                        <span>{bus.route?.source} → {bus.route?.destination}</span>
                      </div>
                    </Col>
                  </Row>

                  {bus.stops && bus.stops.length > 0 && (
                    <div className="stops-info mt-2">
                      <small className="text-muted">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        Stops: {bus.stops.map(stop => stop.stopName).join(' → ')}
                      </small>
                    </div>
                  )}
                </Col>

                <Col md={4} className="text-end">
                  <div className="price-section mb-3">
                    <h4 className="text-primary mb-1">₹{calculateFare(bus)}</h4>
                    <small className="text-muted">per seat</small>
                  </div>
                  
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => handleBook(bus.busID)}
                    className="book-btn w-100"
                  >
                    <i className="fas fa-ticket-alt me-2"></i>
                    Select Seats
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default SearchResults;