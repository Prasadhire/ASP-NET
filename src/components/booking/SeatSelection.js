import React from 'react';
import './SeatSelection.css';

function SeatSelection({ totalSeats, bookedSeats, selectedSeat, onSeatSelect }) {
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);
  
  const isSeatBooked = (seatNumber) => bookedSeats.includes(seatNumber);
  const isSeatSelected = (seatNumber) => selectedSeat === seatNumber;

  const handleSeatClick = (seatNumber) => {
    if (!isSeatBooked(seatNumber)) {
      onSeatSelect(seatNumber);
    }
  };

  // Create rows of 4 seats each
  const seatRows = [];
  for (let i = 0; i < seats.length; i += 4) {
    seatRows.push(seats.slice(i, i + 4));
  }

  return (
    <div className="seat-selection">
      <div className="bus-layout">
        {/* Driver Section */}
        <div className="driver-section">
          <div className="driver-seat">🚗 Driver</div>
          <div className="steering-wheel">⎔</div>
        </div>

        {/* Seats Grid */}
        <div className="seats-container">
          {seatRows.map((row, rowIndex) => (
            <div key={rowIndex} className="seat-row">
              {/* Left Side Seats */}
              {row.slice(0, 2).map(seat => (
                <div
                  key={seat}
                  className={`seat ${isSeatBooked(seat) ? 'booked' : ''} ${
                    isSeatSelected(seat) ? 'selected' : ''
                  }`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat}
                </div>
              ))}
              
              {/* Aisle Space */}
              <div className="aisle-space"></div>
              
              {/* Right Side Seats */}
              {row.slice(2, 4).map(seat => (
                <div
                  key={seat}
                  className={`seat ${isSeatBooked(seat) ? 'booked' : ''} ${
                    isSeatSelected(seat) ? 'selected' : ''
                  }`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat booked"></div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div>
          <span>Selected</span>
        </div>
      </div>

      {/* Selected Seat Info */}
      {selectedSeat && (
        <div className="selected-seat-info">
          <strong>Selected Seat: {selectedSeat}</strong>
        </div>
      )}
    </div>
  );
}

export default SeatSelection;