import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table, Badge, Spinner, Alert, Modal, Form } from 'react-bootstrap';
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
  const [showAddBusModal, setShowAddBusModal] = useState(false);
  const [newBus, setNewBus] = useState({
    busNumber: '',
    busName: '',
    totalSeats: 40,
    type: 'AC',
    status: 'Active'
  });
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
      setRecentBookings(bookingsResponse.data.slice(0, 5));
    } catch (err) {
      toast.error('Failed to load dashboard data');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBus = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createBus(newBus);
      toast.success('Bus added successfully!');
      setShowAddBusModal(false);
      setNewBus({
        busNumber: '',
        busName: '',
        totalSeats: 40,
        type: 'AC',
        status: 'Active'
      });
      fetchDashboardData(); // Refresh data
    } catch (err) {
      toast.error('Failed to add bus');
      console.error('Add bus error:', err);
    }
  };

  const handleDeleteBus = async (busId) => {
    if (window.confirm('Are you sure you want to delete this bus?')) {
      try {
        await adminAPI.deleteBus(busId);
        toast.success('Bus deleted successfully!');
        fetchDashboardData(); // Refresh data
      } catch (err) {
        toast.error('Failed to delete bus');
        console.error('Delete bus error:', err);
      }
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

  const bookingStatusData = [
    { name: 'Confirmed', value: recentBookings.filter(b => b.status === 'Confirmed').length },
    { name: 'Completed', value: recentBookings.filter(b => b.status === 'Completed').length },
    { name: 'Cancelled', value: recentBookings.filter(b => b.status === 'Cancelled').length },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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

      {/* Charts and Analytics */}
      <Row className="mb-4">
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

        {/* Booking Status Chart */}
        <Col lg={6} className="mb-4">
          <Card>
            <Card.Header>
              <h5 className="mb-0">
                <i className="fas fa-chart-bar me-2"></i>
                Booking Status
              </h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bookingStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Bookings */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-clock me-2"></i>
                Recent Bookings
              </h5>
              <Button variant="outline-primary" size="sm" onClick={fetchDashboardData}>
                <i className="fas fa-sync-alt me-1"></i>
                Refresh
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Booking ID</th>
                    <th>Passenger</th>
                    <th>Route</th>
                    <th>Seat</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.map((booking) => (
                    <tr key={booking.bookingID}>
                      <td>#{booking.bookingID}</td>
                      <td>{booking.passenger?.fullName || 'N/A'}</td>
                      <td>
                        {booking.fromStopName} → {booking.toStopName}
                      </td>
                      <td>{booking.seatNumber}</td>
                      <td>
                        <Badge bg={getStatusVariant(booking.status)}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {recentBookings.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-3">
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

      {/* Bus Management */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">
                <i className="fas fa-bus me-2"></i>
                Bus Management
              </h5>
              <Button variant="primary" size="sm" onClick={() => setShowAddBusModal(true)}>
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
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => handleDeleteBus(bus.busID)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {buses.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-3">
                        No buses found. Add your first bus!
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Bus Modal */}
      <Modal show={showAddBusModal} onHide={() => setShowAddBusModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Bus</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleAddBus}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Bus Number *</Form.Label>
              <Form.Control
                type="text"
                value={newBus.busNumber}
                onChange={(e) => setNewBus({...newBus, busNumber: e.target.value})}
                placeholder="e.g., GJ05AB1234"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Bus Name *</Form.Label>
              <Form.Control
                type="text"
                value={newBus.busName}
                onChange={(e) => setNewBus({...newBus, busName: e.target.value})}
                placeholder="e.g., Shree Travels"
                required
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Seats *</Form.Label>
                  <Form.Control
                    type="number"
                    value={newBus.totalSeats}
                    onChange={(e) => setNewBus({...newBus, totalSeats: parseInt(e.target.value)})}
                    min="1"
                    max="100"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Bus Type *</Form.Label>
                  <Form.Select
                    value={newBus.type}
                    onChange={(e) => setNewBus({...newBus, type: e.target.value})}
                    required
                  >
                    <option value="AC">AC</option>
                    <option value="Non-AC">Non-AC</option>
                    <option value="Sleeper">Sleeper</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Status *</Form.Label>
              <Form.Select
                value={newBus.status}
                onChange={(e) => setNewBus({...newBus, status: e.target.value})}
                required
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Maintenance">Maintenance</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAddBusModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Add Bus
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
}

export default AdminDashboard;