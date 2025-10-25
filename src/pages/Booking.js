import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Badge } from 'react-bootstrap';
import { busAPI, bookingAPI } from '../services/api';
import SeatSelection from '../components/booking/SeatSelection';
import './Booking.css';

function Booking() {
  const { busId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const searchParams = new URLSearchParams(location.search);
  const source = searchParams.get('source');
  const destination = searchParams.get('destination');

  const [bus, setBus] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [passenger, setPassenger] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true);
        
        // Fetch bus details
        const busResponse = await busAPI.getBus(busId);
        setBus(busResponse.data);

        // Fetch booked seats for this bus
        const bookingsResponse = await bookingAPI.getBookingsByBus(busId);
        const booked = bookingsResponse.data
          .filter(b => b.status !== 'Completed' && b.status !== 'Cancelled')
          .map(b => b.seatNumber);
        setBookedSeats(booked);
        
      } catch (err) {
        setError('Failed to fetch bus details. Please try again.');
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBusDetails();
  }, [busId]);

  const handleSeatSelect = (seatNumber) => {
    setSelectedSeat(seatNumber);
    setError('');
  };

  const handlePassengerChange = (e) => {
    setPassenger({
      ...passenger,
      [e.target.name]: e.target.value
    });
  };

  const calculateFare = () => {
    if (!bus) return 0;
    return bus.type === 'AC' ? 800 : 500;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedSeat) {
      setError('Please select a seat.');
      return;
    }

    if (!passenger.name || !passenger.phone) {
      setError('Please fill in all required fields.');
      return;
    }

    // Phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(passenger.phone)) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const bookingData = {
        busID: parseInt(busId),
        fromStopName: source,
        toStopName: destination,
        seatNumber: selectedSeat,
        passengerName: passenger.name,
        passengerEmail: passenger.email,
        passengerPhone: passenger.phone
      };

      const response = await bookingAPI.createBooking(bookingData);
      
      if (response.data.booking) {
        navigate(`/ticket/${response.data.booking.bookingID}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking. Please try again.');
      console.error('Booking error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container className="booking-loading">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="loading-text">Loading bus details...</p>
      </Container>
    );
  }

  return (
    <div className="booking-page">
      <Container>
        <div className="booking-header">
          <h2>Book Your Journey</h2>
          <p className="booking-route">
            From <strong>{source}</strong> to <strong>{destination}</strong>
          </p>
        </div>

        {error && <Alert variant="danger" className="booking-alert">{error}</Alert>}

        <Row>
          {/* Left Column - Bus Details & Seat Selection */}
          <Col lg={8}>
            {/* Bus Details Card */}
            <Card className="booking-card bus-details-card">
              <Card.Header className="card-header-primary">
                <h5 className="mb-0">🚌 Bus Details</h5>
              </Card.Header>
              <Card.Body>
                {bus && (
                  <Row>
                    <Col md={6}>
                      <div className="detail-item">
                        <strong>Bus Name:</strong> {bus.busName}
                      </div>
                      <div className="detail-item">
                        <strong>Bus Number:</strong> {bus.busNumber}
                      </div>
                      <div className="detail-item">
                        <strong>Type:</strong> 
                        <Badge bg={bus.type === 'AC' ? 'info' : 'warning'} className="type-badge">
                          {bus.type}
                        </Badge>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="detail-item">
                        <strong>Total Seats:</strong> {bus.totalSeats}
                      </div>
                      <div className="detail-item">
                        <strong>Available Seats:</strong> 
                        <span className="available-seats">
                          {bus.totalSeats - bookedSeats.length}
                        </span>
                      </div>
                      <div className="detail-item">
                        <strong>Status:</strong> 
                        <Badge bg={bus.status === 'Active' ? 'success' : 'danger'} className="status-badge">
                          {bus.status}
                        </Badge>
                      </div>
                    </Col>
                  </Row>
                )}
              </Card.Body>
            </Card>

            {/* Seat Selection Card */}
            <Card className="booking-card seat-selection-card">
              <Card.Header className="card-header-success">
                <h5 className="mb-0">💺 Select Your Seat</h5>
              </Card.Header>
              <Card.Body>
                <SeatSelection
                  totalSeats={bus?.totalSeats || 40}
                  bookedSeats={bookedSeats}
                  selectedSeat={selectedSeat}
                  onSeatSelect={handleSeatSelect}
                />
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Passenger Details & Booking Summary */}
          <Col lg={4}>
            <Card className="booking-card passenger-card sticky-card">
              <Card.Header className="card-header-warning">
                <h5 className="mb-0">👤 Passenger Details</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="form-group-custom">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={passenger.name}
                      onChange={handlePassengerChange}
                      placeholder="Enter your full name"
                      required
                      className="form-control-custom"
                    />
                  </Form.Group>

                  <Form.Group className="form-group-custom">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={passenger.email}
                      onChange={handlePassengerChange}
                      placeholder="Enter your email"
                      className="form-control-custom"
                    />
                    <Form.Text className="form-text-custom">
                      Optional - for booking confirmation
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="form-group-custom">
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={passenger.phone}
                      onChange={handlePassengerChange}
                      placeholder="Enter 10-digit phone number"
                      pattern="[0-9]{10}"
                      required
                      className="form-control-custom"
                    />
                    <Form.Text className="form-text-custom">
                      Required for booking retrieval
                    </Form.Text>
                  </Form.Group>

                  {/* Booking Summary */}
                  <div className="booking-summary">
                    <h6>📋 Booking Summary</h6>
                    <div className="summary-divider"></div>
                    
                    {selectedSeat ? (
                      <>
                        <div className="summary-item">
                          <span>Seat Number:</span>
                          <strong className="selected-seat">#{selectedSeat}</strong>
                        </div>
                        <div className="summary-item">
                          <span>Route:</span>
                          <strong>{source} → {destination}</strong>
                        </div>
                        <div className="summary-item">
                          <span>Bus:</span>
                          <strong>{bus?.busName}</strong>
                        </div>
                        <div className="summary-item">
                          <span>Bus Type:</span>
                          <Badge bg={bus?.type === 'AC' ? 'info' : 'warning'} className="type-badge-small">
                            {bus?.type}
                          </Badge>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-total">
                          <span>Total Fare:</span>
                          <span className="total-fare">₹{calculateFare()}</span>
                        </div>
                      </>
                    ) : (
                      <p className="no-seat-message">
                        Select a seat to see summary
                      </p>
                    )}
                  </div>

                  <Button 
                    variant="success" 
                    type="submit" 
                    disabled={!selectedSeat || submitting}
                    className="booking-button"
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Processing...
                      </>
                    ) : (
                      '🎫 Confirm Booking'
                    )}
                  </Button>

                  <div className="terms-text">
                    <small>
                      By booking, you agree to our terms and conditions
                    </small>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Booking;