import React from 'react';

const RouteStopsModal = ({ route, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Route Stops</h3>
          <button type="button" className="close-btn" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body p-4">
          <div className="route-details mb-4">
            <h4>{route.Source} → {route.Destination}</h4>
            <p className="text-muted">
              Bus: {route.BusName} ({route.BusNumber})
            </p>
          </div>

          <div className="stops-list">
            {route.Stops?.map((stop, index) => (
              <div key={index} className="stop-item d-flex align-items-center mb-3">
                <div className="stop-number">{index + 1}</div>
                <div className="stop-details flex-grow-1">
                  <h5 className="mb-1">{stop.Name}</h5>
                  <p className="text-muted mb-0">
                    Arrival: {stop.ArrivalTime} | Departure: {stop.DepartureTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteStopsModal;
