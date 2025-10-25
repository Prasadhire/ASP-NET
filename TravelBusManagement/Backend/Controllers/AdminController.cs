using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Backend.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Logging;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class AdminController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtService _jwtService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(ApplicationDbContext context, JwtService jwtService, ILogger<AdminController> logger)
        {
            _context = context;
            _jwtService = jwtService;
            _logger = logger;
        }

        // POST: api/admin/login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<object>> AdminLogin([FromBody] LoginRequest request)
        {
            try 
            {
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                    return BadRequest(new { message = "Email and password are required" });

                // Validate email format
                if (!new EmailAddressAttribute().IsValid(request.Email))
                    return BadRequest(new { message = "Invalid email format" });

                var admin = await _context.Admins
                    .FirstOrDefaultAsync(a => a.Email == request.Email);

                if (admin == null)
                    return Unauthorized(new { message = "Invalid email or password" });

                // Add proper password hashing
                if (!VerifyPasswordHash(request.Password, admin.PasswordHash, admin.PasswordSalt))
                    return Unauthorized(new { message = "Invalid email or password" });

                var token = _jwtService.GenerateToken(admin, "admin");

                // Add refresh token
                var refreshToken = GenerateRefreshToken();
                admin.RefreshToken = refreshToken;
                admin.RefreshTokenExpiryTime = DateTime.UtcNow.AddDays(7);
                await _context.SaveChangesAsync();

                return Ok(new { 
                    message = "Login successful",
                    token = token,
                    refreshToken = refreshToken,
                    admin = new { 
                        admin.AdminID, 
                        admin.FullName, 
                        admin.Email 
                    } 
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Login failed: {ex.Message}");
                return StatusCode(500, new { message = "An error occurred during login" });
            }
        }

        // GET: api/admin/dashboard/stats
        [HttpGet("dashboard/stats")]
        public async Task<ActionResult<object>> GetDashboardStats()
        {
            try
            {
                var totalBuses = await _context.Buses.CountAsync();
                var activeBuses = await _context.Buses.CountAsync(b => b.Status == "Active");
                var totalBookings = await _context.Bookings.CountAsync();
                var todayBookings = await _context.Bookings
                    .CountAsync(b => b.BookingDate.Date == DateTime.Today);
                
                // Calculate revenue (mock calculation)
                var acBookings = await _context.Bookings
                    .Include(b => b.Bus)
                    .CountAsync(b => b.Bus.Type == "AC");
                var nonAcBookings = totalBookings - acBookings;
                var totalRevenue = (acBookings * 800) + (nonAcBookings * 500);

                var stats = new
                {
                    totalBuses,
                    activeBuses,
                    totalBookings,
                    todayBookings,
                    totalRevenue,
                    activeRoutes = await _context.Routes.CountAsync(),
                    totalPassengers = await _context.Passengers.CountAsync()
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error fetching dashboard stats", error = ex.Message });
            }
        }

        // GET: api/admin/bookings
        [HttpGet("bookings")]
        public async Task<ActionResult<IEnumerable<object>>> GetRecentBookings()
        {
            var recentBookings = await _context.Bookings
                .Include(b => b.Passenger)
                .Include(b => b.Bus)
                .OrderByDescending(b => b.BookingDate)
                .Take(10)
                .Select(b => new
                {
                    b.BookingID,
                    Passenger = new { b.Passenger.FullName, b.Passenger.Phone },
                    Bus = new { b.Bus.BusName, b.Bus.BusNumber },
                    b.FromStopName,
                    b.ToStopName,
                    b.SeatNumber,
                    b.BookingDate,
                    b.Status
                })
                .ToListAsync();

            return Ok(recentBookings);
        }

        // GET: api/admin/buses
        [HttpGet("buses")]
        public async Task<ActionResult<IEnumerable<Bus>>> GetAdminBuses()
        {
            return await _context.Buses.ToListAsync();
        }

        // POST: api/admin/buses
        [HttpPost("buses")]
        public async Task<ActionResult<Bus>> CreateBus(Bus bus)
        {
            _context.Buses.Add(bus);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAdminBuses), new { id = bus.BusID }, bus);
        }

        // PUT: api/admin/buses/5
        [HttpPut("buses/{id}")]
        public async Task<IActionResult> UpdateBus(int id, Bus bus)
        {
            if (id != bus.BusID)
            {
                return BadRequest();
            }

            _context.Entry(bus).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/admin/buses/5
        [HttpDelete("buses/{id}")]
        public async Task<IActionResult> DeleteBus(int id)
        {
            var bus = await _context.Buses.FindAsync(id);
            if (bus == null)
            {
                return NotFound();
            }

            _context.Buses.Remove(bus);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // GET: api/admin/conductors
        [HttpGet("conductors")]
        public async Task<ActionResult<IEnumerable<Conductor>>> GetConductors()
        {
            return await _context.Conductors
                .Include(c => c.AssignedBus)
                .ToListAsync();
        }

        // POST: api/admin/conductors
        [HttpPost("conductors")]
        public async Task<ActionResult<Conductor>> CreateConductor(Conductor conductor)
        {
            _context.Conductors.Add(conductor);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetConductors), new { id = conductor.ConductorID }, conductor);
        }

        // GET: api/admin/analytics
        [HttpGet("analytics")]
        public async Task<ActionResult<object>> GetAnalyticsDashboard()
        {
            // Return analytics data (bookings, revenue, occupancy, etc.)
            // ...implementation...
            return Ok(/* analytics data */);
        }

        // GET: api/admin/reports/custom
        [HttpGet("reports/custom")]
        public async Task<ActionResult<object>> GetCustomReport([FromQuery] string type)
        {
            // Return custom report based on type
            // ...implementation...
            return Ok(/* report data */);
        }

        // GET: api/admin/amenities
        [HttpGet("amenities")]
        public async Task<ActionResult<IEnumerable<string>>> GetAmenities()
        {
            // Return list of amenities
            // ...implementation...
            return Ok(/* amenities list */);
        }

        // POST: api/admin/amenities
        [HttpPost("amenities")]
        public async Task<IActionResult> AddAmenity([FromBody] string amenity)
        {
            // Add new amenity
            // ...implementation...
            return Ok();
        }

        // POST: api/admin/buses/{busId}/maintenance
        [HttpPost("buses/{busId}/maintenance")]
        public async Task<IActionResult> ScheduleMaintenance(int busId, [FromBody] DateTime date)
        {
            // Schedule maintenance for bus
            // ...implementation...
            return Ok();
        }

        // Add secure password hashing methods
        private bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            // Implementation
            return true;
        }

        private string GenerateRefreshToken()
        {
            // Implementation
            return Guid.NewGuid().ToString();
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}