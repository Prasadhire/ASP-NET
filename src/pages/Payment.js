import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { paymentAPI, bookingAPI } from '../services/api';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import './Payment.css';

function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBookingDetails();
  }, [bookingId]);

  const loadBookingDetails = async () => {
    try {
      const response = await bookingAPI.getBooking(bookingId);
      setBooking(response.data);
    } catch (err) {
      setError('Failed to load booking details');
    }
  };

  const handlePayment = async () => {
    try {
      setProcessing(true);
      const response = await paymentAPI.pay(bookingId, {
        method: selectedMethod,
        amount: booking.totalFare
      });
      navigate(`/ticket/${bookingId}`);
    } catch (err) {
      setError('Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Container className="payment-page">
      {/* Payment form and summary UI */}
    </Container>
  );
}

export default Payment;
