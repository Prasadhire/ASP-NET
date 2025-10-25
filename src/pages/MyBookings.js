import React, { useState } from 'react';
import { Container, Card, Form, Button, Table, Alert, Spinner, Badge } from 'react-bootstrap';
import { bookingAPI } from '../services/api';
import { format } from 'date-fns';
import './MyBookings.css';

function MyBookings() {
  const [phone, setPhone] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const response = await bookingAPI.getBookingsByPhone(phone);
      setBookings(response.data);
    } catch (err) {
      setError('No bookings found for this phone number');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Confirmed': return 'booking-status-confirmed';
      case 'Boarded': return 'booking-status-boarded';
      case 'Completed': return 'booking-status-completed';
      case 'Cancelled': return 'booking-status-cancelled';
      default: return 'booking-status-pending';
    }
  };

  const handleViewTicket = (bookingId) => {
    window.open(`/ticket/${bookingId}`, '_blank');
  };

  return (
    <div className="my-bookings-page">
      <Container>
        <div className="bookings-header">
          <h2>My Bookings</h2>
          <p>View and manage your bus ticket bookings</p>
        </div>
        
        {/* Search Card */}
        <Card className="search-card">
          <Card.Header className="search-card-header">
            <h5 className="mb-0">Find Your Bookings</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={handleSearch} className="search-form">
              <div className="form-row">
                <div className="form-input-col">
                  <Form.Group>
                    <Form.Label className="form-label">Enter Your Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter the phone number used for booking"
                      required
                      className="phone-input"
                    />
                  </Form.Group>
                </div>
                <div className="form-button-col">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    className="search-button"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Searching...
                      </>
                    ) : (
                      'Find Bookings'
                    )}
                  </Button>
                </div>
              </div>
            </Form>
          </Card.Body>
        </Card>

        {error && <Alert variant="danger" className="error-alert">{error}</Alert>}

        {/* Bookings Table */}
        {bookings.length > 0 && (
          <Card className="bookings-card">
            <Card.Header className="bookings-card-header">
              <h5 className="mb-0">Your Booking History</h5>
              <Badge bg="primary" className="bookings-count">
                {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
              </Badge>
            </Card.Header>
            <Card.Body>
              <div className="table-container">
                <Table className="bookings-table">
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Bus Details</th>
                      <th>Route</th>
                      <th>Seat</th>
                      <th>Date & Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.bookingID} className="booking-row">
                        <td className="booking-id">
                          <strong>#{booking.bookingID}</strong>
                        </td>
                        <td className="bus-details">
                          <div className="bus-name">{booking.bus?.busName}</div>
                          <div className="bus-number">{booking.bus?.busNumber}</div>
                          <div className="bus-type">{booking.bus?.type}</div>
                        </td>
                        <td className="route-info">
                          <div className="route-from">{booking.fromStopName}</div>
                          <div className="route-arrow">→</div>
                          <div className="route-to">{booking.toStopName}</div>
                        </td>
                        <td className="seat-info">
                          <Badge bg="secondary" className="seat-badge">
                            Seat {booking.seatNumber}
                          </Badge>
                        </td>
                        <td className="booking-date">
                          <div className="date">{format(new Date(booking.bookingDate), 'dd MMM yyyy')}</div>
                          <div className="time">{format(new Date(booking.bookingDate), 'hh:mm a')}</div>
                        </td>
                        <td className="booking-status">
                          <Badge className={getStatusVariant(booking.status)}>
                            {booking.status}
                          </Badge>
                        </td>
                        <td className="booking-actions">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewTicket(booking.bookingID)}
                            className="view-ticket-btn"
                          >
                            View Ticket
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        )}

        {bookings.length === 0 && !loading && phone && (
          <Card className="no-bookings-card">
            <Card.Body className="no-bookings-body">
              <div className="no-bookings-icon">📭</div>
              <h5>No Bookings Found</h5>
              <p className="no-bookings-text">
                No bookings found for phone number: <strong>{phone}</strong>
              </p>
              <Button 
                variant="outline-primary" 
                onClick={() => setBookings([])}
                className="try-again-btn"
              >
                Try Different Number
              </Button>
            </Card.Body>
          </Card>
        )}
      </Container>
    </div>
  );
}

export default MyBookings;