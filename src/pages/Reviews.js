import React, { useState, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { reviewAPI } from '../services/api';
import StarRating from '../components/common/StarRating';
import './Reviews.css';

function Reviews() {
  const { busId } = useParams();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReviews();
  }, [busId]);

  const loadReviews = async () => {
    try {
      const response = await reviewAPI.getBusReviews(busId);
      setReviews(response.data);
    } catch (err) {
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await reviewAPI.addBusReview(busId, newReview);
      setNewReview({ rating: 0, comment: '' });
      loadReviews();
    } catch (err) {
      setError('Failed to submit review');
    }
  };

  return (
    <Container className="reviews-page">
      {/* Review submission form and reviews list UI */}
    </Container>
  );
}

export default Reviews;
