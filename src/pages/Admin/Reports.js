import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { adminAPI } from '../../services/api';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Reports.css';

function Reports() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    endDate: new Date()
  });
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReportData();
  }, [dateRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRevenueReports({
        startDate: dateRange.startDate.toISOString(),
        endDate: dateRange.endDate.toISOString()
      });
      setReportData(response.data);
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      const response = await adminAPI.exportReport(format, {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      });
      
      // Handle file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error exporting report:', err);
    }
  };

  return (
    <Container className="reports-page">
      <h2 className="page-title">Reports & Analytics</h2>

      {/* Date Range Selector */}
      <Card className="mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Date Range</Form.Label>
                <div className="d-flex">
                  <DatePicker
                    selected={dateRange.startDate}
                    onChange={date => setDateRange({ ...dateRange, startDate: date })}
                    className="form-control me-2"
                  />
                  <DatePicker
                    selected={dateRange.endDate}
                    onChange={date => setDateRange({ ...dateRange, endDate: date })}
                    className="form-control"
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={6} className="text-end">
              <Button variant="outline-primary" className="me-2" onClick={() => handleExport('xlsx')}>
                Export to Excel
              </Button>
              <Button variant="outline-danger" onClick={() => handleExport('pdf')}>
                Export to PDF
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Charts */}
      <Row>
        <Col lg={8} className="mb-4">
          <Card>
            <Card.Header>Revenue Trend</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reportData?.revenue || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="revenue" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4} className="mb-4">
          <Card>
            <Card.Header>Booking Distribution</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={reportData?.bookingDistribution || []}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add more charts and report sections as needed */}
    </Container>
  );
}

export default Reports;
