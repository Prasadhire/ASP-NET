using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConductorController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ConductorController(ApplicationDbContext context)
        {
            _context = context;
        }

        // POST: api/conductor/login
        [HttpPost("login")]
        public async Task<ActionResult<object>> ConductorLogin(LoginRequest request)
        {
            var conductor = await _context.Conductors
                .Include(c => c.AssignedBus)
                .FirstOrDefaultAsync(c => c.Email == request.Email && c.Password == request.Password);

            if (conductor == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            return Ok(new { 
                message = "Login successful", 
                conductor = new { 
                    conductor.ConductorID, 
                    conductor.FullName, 
                    conductor.Email,
                    AssignedBus = conductor.AssignedBus != null ? new {
                        conductor.AssignedBus.BusID,
                        conductor.AssignedBus.BusName,
                        conductor.AssignedBus.BusNumber
                    } : null
                } 
            });
        }

        // GET: api/conductor/passengers/5
        [HttpGet("passengers/{busId}")]
        public async Task<ActionResult<IEnumerable<object>>> GetPassengersByBus(int busId)
        {
            var passengers = await _context.Bookings
                .Include(b => b.Passenger)
                .Include(b => b.Bus)
                .Where(b => b.BusID == busId && (b.Status == "Confirmed" || b.Status == "Boarded"))
                .OrderBy(b => b.SeatNumber)
                .Select(b => new
                {
                    b.BookingID,
                    Passenger = new { b.Passenger.FullName, b.Passenger.Phone },
                    b.FromStopName,
                    b.ToStopName,
                    b.SeatNumber,
                    b.Status
                })
                .ToListAsync();

            return Ok(passengers);
        }

        // PUT: api/conductor/bookings/5/status
        [HttpPut("bookings/{id}/status")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] StatusUpdateRequest request)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            booking.Status = request.Status;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Status updated successfully" });
        }

        // GET: api/conductor/dashboard/5
        [HttpGet("dashboard/{busId}")]
        public async Task<ActionResult<object>> GetConductorDashboard(int busId)
        {
            var totalPassengers = await _context.Bookings
                .CountAsync(b => b.BusID == busId && (b.Status == "Confirmed" || b.Status == "Boarded"));
            
            var boardedPassengers = await _context.Bookings
                .CountAsync(b => b.BusID == busId && b.Status == "Boarded");
            
            var completedPassengers = await _context.Bookings
                .CountAsync(b => b.BusID == busId && b.Status == "Completed");

            var bus = await _context.Buses.FindAsync(busId);

            return Ok(new
            {
                totalPassengers,
                boardedPassengers,
                completedPassengers,
                bus = bus != null ? new { bus.BusName, bus.BusNumber } : null
            });
        }

        // POST: api/conductor/incident
        [HttpPost("incident")]
        public async Task<IActionResult> ReportIncident([FromBody] IncidentReport report)
        {
            // Save incident report
            // ...implementation...
            return Ok();
        }

        // GET: api/conductor/daily-collection/5
        [HttpGet("daily-collection/{busId}")]
        public async Task<ActionResult<object>> GetDailyCollection(int busId)
        {
            // Return daily collection report
            // ...implementation...
            return Ok(/* collection data */);
        }
    }

    public class StatusUpdateRequest
    {
        public string Status { get; set; }
    }
}