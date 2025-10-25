import React, { useState, useEffect } from 'react';
import DataTable from '../../components/common/DataTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminApi } from '../../services/api';
import './Bookings.css';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getBookings();
      setBookings(response.data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (booking) => {
    // Implement view booking details
    console.log('View booking:', booking);
    alert(`View booking: ${booking.BookingID}`);
  };

  const handleUpdateStatus = async (booking, newStatus) => {
    try {
      await adminApi.updateBookingStatus(booking.BookingID, newStatus);
      fetchBookings(); // Refresh data
    } catch (err) {
      setError('Failed to update booking status');
    }
  };

  const handleDeleteBooking = async (booking) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await adminApi.deleteBooking(booking.BookingID);
        fetchBookings(); // Refresh data
      } catch (err) {
        setError('Failed to delete booking');
      }
    }
  };

  const bookingColumns = [
    {
      key: 'BookingID',
      header: 'Booking ID',
      minWidth: '120px'
    },
    {
      key: 'Passenger',
      header: 'Passenger',
      render: (value, item) => (
        <div>
          <div><strong>{item.Passenger?.FullName}</strong></div>
          <small className="text-muted">{item.Passenger?.Phone}</small>
        </div>
      )
    },
    {
      key: 'Bus',
      header: 'Bus Details',
      render: (value, item) => (
        <div>
          <div>{item.Bus?.BusName}</div>
          <small className="text-muted">{item.Bus?.BusNumber}</small>
        </div>
      )
    },
    {
      key: 'Route',
      header: 'Route',
      render: (value, item) => (
        <div>
          <div>{item.FromStopName} → {item.ToStopName}</div>
        </div>
      )
    },
    {
      key: 'SeatNumber',
      header: 'Seat',
      minWidth: '80px'
    },
    {
      key: 'BookingDate',
      header: 'Booking Date',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'Status',
      header: 'Status',
      render: (value) => (
        <span className={`status-badge status-${value.toLowerCase()}`}>
          {value}
        </span>
      )
    }
  ];

  if (loading) return <LoadingSpinner text="Loading bookings..." />;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="bookings-page">
      <div className="page-header">
        <h2>Bookings Management</h2>
        <p>Manage all bus bookings and their status</p>
      </div>

      <div className="bookings-content">
        <DataTable
          columns={bookingColumns}
          data={bookings}
          keyField="BookingID"
          onView={handleViewBooking}
          onDelete={handleDeleteBooking}
          searchable={true}
          pagination={true}
        />
      </div>
    </div>
  );
};

export default Bookings;