import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { adminAPI, busAPI, bookingAPI } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { toast } from 'react-toastify';
import './Admin.css';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [buses, setBuses] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { admin, logoutAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!admin) {
      navigate('/admin/login');
      return;
    }
    fetchDashboardData();
  }, [admin, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, busesResponse, bookingsResponse] = await Promise.all([
        adminAPI.getDashboardStats(),
        busAPI.getAllBuses(),
        bookingAPI.getAllBookings()
      ]);

      setStats(statsResponse.data);
      setBuses(busesResponse.data);
      setRecentBookings(bookingsResponse.data.slice(0, 5)); // Last 5 bookings
    } catch (err) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutAdmin();
    toast.info('Logged out successfully');
    navigate('/');
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'success';
      case 'inactive': return 'secondary';
      case 'confirmed': return 'primary';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  };

  // Chart data
  const busTypeData = [
    { name: 'AC', value: buses.filter(b => b.type === 'AC').length },
    { name: 'Non-AC', value: buses.filter(b => b.type === 'Non-AC').length },
    { name: 'Sleeper', value: buses.filter(b => b.type === 'Sleeper').length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  if (loading) {
    return (
      <Container className="admin-dashboard mt-4">
        <div className="text-center">
          <Spinner animation="border" role="status" variant="primary">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
          <p className="mt-3">Loading dashboard...</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="admin-dashboard mt-4">
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>Admin Dashboard</h2>
              <p className="text-muted mb-0">Welcome back, {admin?.fullName}</p>
            </div>
            <Button variant="outline-danger" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt me-2"></i>
              Logout
            </Button>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-primary">
                  <i className="fas fa-bus"></i>
                </div>
                <div className="ms-3">
                  <h4 className="mb-0">{stats?.totalBuses || 0}</h4>
                  <p className="text-muted mb-0">Total Buses</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-success">
                  <i className="fas fa-bus"></i>
                </div>
                <div className="ms-3">
                  <h4 className="mb-0">{stats?.activeBuses || 0}</h4>
                  <p className="text-muted mb-0">Active Buses</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-info">
                  <i className="fas fa-ticket-alt"></i>
                </div>
                <div className="ms-3">
                  <h4 className="mb-0">{stats?.totalBookings || 0}</h4>
                  <p className="text-muted mb-0">Total Bookings</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="stat-card">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="stat-icon bg-warning">
                  <i className="fas fa-calendar-day"></i>
                </div>
                <div className="ms-3">
                  <h4 className="mb-0">{stats?.todayBookings || 0}</h4>
                  <p className="text-muted mb-0">Today's Bookings</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts and Tables */}
      <Row>
        {/* Bus Types Chart */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Bus Types Distribution
              </h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={busTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {busTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Recent Bookings */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Bookings
              </h5>
              <Button variant="outline-primary" size="sm">
                View All
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Booking ID</th>
                    <th>Route</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.bookingID}>
                      <td>#{booking.bookingID}</td>
                      <td>
                        {booking.fromStopName} → {booking.toStopName}
                      </td>
                      <td>
                        <Badge bg={getStatusVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                  {recentBookings.length === 0 && (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-3">
                        No recent bookings
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Buses Management */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-bus me-2"></i>
                Bus Management
              </h5>
              <Button variant="primary" size="sm">
                <i className="fas fa-plus me-1"></i>
                Add New Bus
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Bus Number</th>
                    <th>Bus Name</th>
                    <th>Type</th>
                    <th>Seats</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {buses.map((bus) => (
                    <tr key={bus.busID}>
                      <td>
                        <strong>{bus.busNumber}</strong>
                      </td>
                      <td>{bus.busName}</td>
                      <td>
                        <Badge bg="info">{bus.type}</Badge>
                      </td>
                      <td>{bus.totalSeats}</td>
                      <td>
                        <Badge bg={getStatusVariant(bus.status)}>
                          {bus.status}
                        </Badge>
                      </td>
                      <td>
                        <Button variant="outline-primary" size="sm" className="me-1">
                          <i className="fas fa-edit"></i>
                        </Button>
                        <Button variant="outline-danger" size="sm">
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {buses.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-3">
                        No buses found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bookings Overview Chart */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <h4 className="mb-4">Bookings Overview</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.bookingsChart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#667eea" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminDashboard;