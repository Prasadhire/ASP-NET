import React from 'react';
import { Card, ListGroup, Button, Badge } from 'react-bootstrap';
import { format } from 'date-fns';

function BookingSummary({ bus, source, destination, date, selectedSeat, fare, onBook }) {
  const bookingDetails = [
    { label: 'Bus', value: bus?.busName },
    { label: 'Bus Number', value: bus?.busNumber },
    { label: 'Type', value: <Badge bg="primary">{bus?.type}</Badge> },
    { label: 'From', value: source },
    { label: 'To', value: destination },
    { label: 'Travel Date', value: date ? format(new Date(date), 'MMM dd, yyyy') : 'Today' },
    { label: 'Selected Seat', value: selectedSeat ? `Seat ${selectedSeat}` : 'Not selected' },
  ];

  return (
    <Card className="sticky-top" style={{ top: '100px' }}>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">
          <i className="fas fa-receipt me-2"></i>
          Booking Summary
        </h5>
      </Card.Header>
      
      <ListGroup variant="flush">
        {bookingDetails.map((detail, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
            <span className="text-muted">{detail.label}:</span>
            <span className="fw-bold">{detail.value}</span>
          </ListGroup.Item>
        ))}
        
        <ListGroup.Item className="d-flex justify-content-between align-items-center bg-light">
          <span className="text-muted">Fare:</span>
          <span className="fw-bold text-primary fs-5">₹{fare}</span>
        </ListGroup.Item>
      </ListGroup>
      
      <Card.Body>
        <Button
          variant="primary"
          size="lg"
          className="w-100"
          onClick={onBook}
          disabled={!selectedSeat}
        >
          {selectedSeat ? (
            <>
              <i className="fas fa-lock me-2"></i>
              Book Now - ₹{fare}
            </>
          ) : (
            'Select a Seat First'
          )}
        </Button>
        
        <div className="text-center mt-3">
          <small className="text-muted">
            <i className="fas fa-shield-alt me-1"></i>
            Your payment is secure and encrypted
          </small>
        </div>
      </Card.Body>
    </Card>
  );
}

export default BookingSummary;