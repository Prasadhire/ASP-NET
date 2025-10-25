import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { conductorAPI } from '../../services/api';
import './Conductor.css';

function ConductorDashboard() {
  const [passengers, setPassengers] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const conductor = JSON.parse(localStorage.getItem('conductor'));
    if (!conductor) {
      navigate('/conductor/login');
      return;
    }

    loadPassengerData();
  }, [navigate]);

  const loadPassengerData = async () => {
    try {
      setLoading(true);
      setError('');
      const conductor = JSON.parse(localStorage.getItem('conductor'));
      
      if (conductor && conductor.assignedBus) {
        const busId = conductor.assignedBus.busID;
        
        // Load passengers
        const passengersResponse = await conductorAPI.getPassengers(busId);
        setPassengers(passengersResponse.data);

        // Load dashboard stats
        const dashboardResponse = await conductorAPI.getDashboard(busId);
        setDashboardData(dashboardResponse.data);
      } else {
        setError('No bus assigned to this conductor.');
      }
    } catch (error) {
      setError('Failed to load passenger data. Please try again.');
      console.error('Error loading passenger data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updatePassengerStatus = async (bookingId, newStatus) => {
    try {
      setUpdating(bookingId);
      await conductorAPI.updateBookingStatus(bookingId, newStatus);
      
      // Refresh data
      await loadPassengerData();
    } catch (error) {
      setError('Failed to update passenger status.');
      console.error('Error updating status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Confirmed': return 'passenger-status-confirmed';
      case 'Boarded': return 'passenger-status-boarded';
      case 'Completed': return 'passenger-status-completed';
      default: return 'passenger-status-pending';
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('conductor');
    navigate('/conductor/login');
  };

  if (loading) {
    return (
      <div className="conductor-loading">
        <Container className="text-center">
          <Spinner animation="border" role="status" variant="warning">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="loading-text">Loading Passenger List...</p>
        </Container>
      </div>
    );
  }

  const conductor = JSON.parse(localStorage.getItem('conductor'));

  return (
    <div className="conductor-dashboard">
      <Container>
        {/* Header */}
        <div className="conductor-header">
          <div className="header-content">
            <div className="header-info">
              <h2>Conductor Dashboard</h2>
              <p className="bus-info">
                Managing: <strong>{conductor?.assignedBus?.busName}</strong> 
                ({conductor?.assignedBus?.busNumber})
              </p>
            </div>
            <Button 
              variant="outline-danger" 
              onClick={handleLogout}
              className="logout-button"
            >
              🚪 Logout
            </Button>
          </div>
        </div>

        {error && <Alert variant="danger" className="dashboard-alert">{error}</Alert>}

        {/* Stats Cards */}
        {dashboardData && (
          <Row className="stats-row">
            <Col md={4} className="mb-4">
              <Card className="stats-card total-passengers">
                <Card.Body>
                  <div className="stats-icon">👥</div>
                  <div className="stats-content">
                    <div className="stats-number">{dashboardData.totalPassengers}</div>
                    <div className="stats-label">Total Passengers</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="stats-card boarded-passengers">
                <Card.Body>
                  <div className="stats-icon">✅</div>
                  <div className="stats-content">
                    <div className="stats-number">{dashboardData.boardedPassengers}</div>
                    <div className="stats-label">Boarded</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} className="mb-4">
              <Card className="stats-card completed-passengers">
                <Card.Body>
                  <div className="stats-icon">🎯</div>
                  <div className="stats-content">
                    <div className="stats-number">{dashboardData.completedPassengers}</div>
                    <div className="stats-label">Completed</div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* Passengers Table */}
        <Card className="passengers-card">
          <Card.Header className="passengers-card-header">
            <div className="passengers-header-content">
              <h5 className="passengers-title">Passenger List</h5>
              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={loadPassengerData}
                className="refresh-button"
              >
                🔄 Refresh
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {passengers.length > 0 ? (
              <div className="table-container">
                <Table className="passengers-table">
                  <thead>
                    <tr>
                      <th>Seat</th>
                      <th>Passenger Details</th>
                      <th>Route</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {passengers.map(passenger => (
                      <tr key={passenger.bookingID} className="passenger-row">
                        <td className="seat-cell">
                          <Badge className="seat-badge">
                            {passenger.seatNumber}
                          </Badge>
                        </td>
                        <td className="passenger-details">
                          <div className="passenger-name">{passenger.passenger.fullName}</div>
                          <div className="passenger-phone">{passenger.passenger.phone}</div>
                        </td>
                        <td className="route-cell">
                          <div className="route-from">{passenger.fromStopName}</div>
                          <div className="route-arrow">→</div>
                          <div className="route-to">{passenger.toStopName}</div>
                        </td>
                        <td className="status-cell">
                          <Badge className={getStatusVariant(passenger.status)}>
                            {passenger.status}
                          </Badge>
                        </td>
                        <td className="actions-cell">
                          <div className="action-buttons">
                            {passenger.status === 'Confirmed' && (
                              <Button
                                variant="success"
                                size="sm"
                                disabled={updating === passenger.bookingID}
                                onClick={() => updatePassengerStatus(passenger.bookingID, 'Boarded')}
                                className="action-button board-button"
                              >
                                {updating === passenger.bookingID ? (
                                  <Spinner size="sm" />
                                ) : (
                                  '✅ Mark Boarded'
                                )}
                              </Button>
                            )}
                            {passenger.status === 'Boarded' && (
                              <Button
                                variant="primary"
                                size="sm"
                                disabled={updating === passenger.bookingID}
                                onClick={() => updatePassengerStatus(passenger.bookingID, 'Completed')}
                                className="action-button complete-button"
                              >
                                {updating === passenger.bookingID ? (
                                  <Spinner size="sm" />
                                ) : (
                                  '🎯 Mark Completed'
                                )}
                              </Button>
                            )}
                            {(passenger.status === 'Confirmed' || passenger.status === 'Boarded') && (
                              <Button
                                variant="outline-danger"
                                size="sm"
                                disabled={updating === passenger.bookingID}
                                onClick={() => updatePassengerStatus(passenger.bookingID, 'Cancelled')}
                                className="action-button cancel-button"
                              >
                                ❌ Cancel
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            ) : (
              <div className="no-passengers">
                <div className="no-passengers-icon">👥</div>
                <h5>No Passengers Found</h5>
                <p className="no-passengers-text">No active passengers for this bus.</p>
                <Button 
                  variant="outline-primary" 
                  onClick={loadPassengerData}
                  className="retry-button"
                >
                  🔄 Refresh
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

export default ConductorDashboard;