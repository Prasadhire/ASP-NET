import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import './Ticket.css';

function Ticket({ booking }) {
  if (!booking) return null;

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'boarded': return 'primary';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <Card className="ticket-card">
      <Card.Body className="p-4">
        {/* Ticket Header */}
        <div className="ticket-header text-center mb-4">
          <div className="company-logo">
            <i className="fas fa-bus"></i>
            <span>TravelBus</span>
          </div>
          <h4 className="mb-0">E-Ticket</h4>
          <Badge bg={getStatusVariant(booking.status)} className="mt-2">
            {booking.status}
          </Badge>
        </div>

        {/* Ticket Content */}
        <Row className="ticket-content">
          <Col md={6}>
            <div className="ticket-section">
              <h6 className="section-title">Journey Details</h6>
              <div className="detail-row">
                <span className="label">Route:</span>
                <span className="value">
                  {booking.fromStopName} → {booking.toStopName}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Bus:</span>
                <span className="value">{booking.bus?.busName}</span>
              </div>
              <div className="detail-row">
                <span className="label">Bus No:</span>
                <span className="value">{booking.bus?.busNumber}</span>
              </div>
              <div className="detail-row">
                <span className="label">Type:</span>
                <span className="value">{booking.bus?.type}</span>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="ticket-section">
              <h6 className="section-title">Passenger Details</h6>
              <div className="detail-row">
                <span className="label">Name:</span>
                <span className="value">{booking.passenger?.fullName}</span>
              </div>
              <div className="detail-row">
                <span className="label">Phone:</span>
                <span className="value">{booking.passenger?.phone}</span>
              </div>
              <div className="detail-row">
                <span className="label">Email:</span>
                <span className="value">{booking.passenger?.email}</span>
              </div>
              <div className="detail-row">
                <span className="label">Seat:</span>
                <span className="value seat-number">#{booking.seatNumber}</span>
              </div>
            </div>
          </Col>
        </Row>

        {/* Ticket Footer */}
        <Row className="ticket-footer mt-4">
          <Col md={6}>
            <div className="ticket-section">
              <h6 className="section-title">Booking Information</h6>
              <div className="detail-row">
                <span className="label">Booking ID:</span>
                <span className="value booking-id">#{booking.bookingID}</span>
              </div>
              <div className="detail-row">
                <span className="label">Booking Date:</span>
                <span className="value">
                  {format(parseISO(booking.bookingDate), 'MMM dd, yyyy hh:mm a')}
                </span>
              </div>
            </div>
          </Col>

          <Col md={6}>
            <div className="ticket-section text-center">
              <div className="barcode-placeholder">
                <i className="fas fa-barcode fa-2x mb-2"></i>
                <div>Booking Reference</div>
                <small className="text-muted">#{booking.bookingID}</small>
              </div>
            </div>
          </Col>
        </Row>

        {/* Important Notes */}
        <div className="ticket-notes mt-4 p-3 bg-light rounded">
          <h6 className="section-title mb-2">Important Instructions</h6>
          <ul className="list-unstyled mb-0">
            <li><i className="fas fa-check-circle text-success me-2"></i> Arrive at boarding point 30 minutes before departure</li>
            <li><i className="fas fa-check-circle text-success me-2"></i> Carry valid ID proof for verification</li>
            <li><i className="fas fa-check-circle text-success me-2"></i> Show this e-ticket to the conductor</li>
            <li><i className="fas fa-check-circle text-success me-2"></i> Keep your phone charged for ticket verification</li>
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Ticket;