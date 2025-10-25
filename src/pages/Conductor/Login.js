import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { conductorAPI } from '../../services/api';
import './Conductor.css';

function ConductorLogin() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const response = await conductorAPI.login(formData);
      
      if (response.data.conductor) {
        localStorage.setItem('conductor', JSON.stringify(response.data.conductor));
        navigate('/conductor/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="conductor-login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={6} lg={4}>
            <Card className="conductor-login-card">
              <Card.Header className="conductor-login-header">
                <div className="login-icon">👨‍✈️</div>
                <h3 className="login-title">Conductor Login</h3>
                <p className="login-subtitle">Manage your bus passengers</p>
              </Card.Header>
              <Card.Body className="conductor-login-body">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="login-form-group">
                    <Form.Label className="form-label">Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter conductor email"
                      required
                      className="login-input"
                    />
                  </Form.Group>

                  <Form.Group className="login-form-group">
                    <Form.Label className="form-label">Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      required
                      className="login-input"
                    />
                  </Form.Group>

                  {error && <Alert variant="danger" className="login-alert">{error}</Alert>}

                  <Button
                    variant="warning"
                    type="submit"
                    disabled={loading}
                    className="login-button"
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Signing In...
                      </>
                    ) : (
                      '🚌 Login to Dashboard'
                    )}
                  </Button>
                </Form>

                <div className="demo-credentials">
                  <div className="demo-title">Demo Credentials</div>
                  <div className="demo-email">Email: conductor@travelbus.com</div>
                  <div className="demo-password">Password: conductor123</div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ConductorLogin;