using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Backend.Hubs;
using Backend.Services;
using QRCoder;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IHubContext<BookingHub> _hubContext;
        private readonly EmailService _emailService;
        private readonly QRCodeGenerator _qrGenerator;

        public BookingsController(
            ApplicationDbContext context, 
            IHubContext<BookingHub> hubContext,
            EmailService emailService)
        {
            _context = context;
            _hubContext = hubContext;
            _emailService = emailService;
            _qrGenerator = new QRCodeGenerator();
        }

        // GET: api/bookings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookings()
        {
            return await _context.Bookings
                .Include(b => b.Passenger)
                .Include(b => b.Bus)
                .ToListAsync();
        }

        // GET: api/bookings/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBooking(int id)
        {
            var booking = await _context.Bookings
                .Include(b => b.Passenger)
                .Include(b => b.Bus)
                .FirstOrDefaultAsync(b => b.BookingID == id);

            if (booking == null)
            {
                return NotFound();
            }

            return booking;
        }

        // GET: api/bookings/passenger?phone=1234567890
        [HttpGet("passenger")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsByPhone(string phone)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Passenger)
                .Include(b => b.Bus)
                .Where(b => b.Passenger.Phone == phone)
                .OrderByDescending(b => b.BookingDate)
                .ToListAsync();

            return bookings;
        }

        // GET: api/bookings/bus/5
        [HttpGet("bus/{busId}")]
        public async Task<ActionResult<IEnumerable<Booking>>> GetBookingsByBus(int busId)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Passenger)
                .Include(b => b.Bus)
                .Where(b => b.BusID == busId)
                .OrderBy(b => b.SeatNumber)
                .ToListAsync();

            return bookings;
        }

        // GET: api/bookings/5/qrcode
        [HttpGet("{bookingId}/qrcode")]
        public async Task<IActionResult> GetBookingQRCode(int bookingId)
        {
            var booking = await _context.Bookings
                .Include(b => b.Passenger)
                .Include(b => b.Bus)
                .FirstOrDefaultAsync(b => b.BookingID == bookingId);

            if (booking == null)
                return NotFound();

            var qrData = $"BOOKING:{booking.BookingID}|BUS:{booking.Bus.BusNumber}|SEAT:{booking.SeatNumber}";
            var qrCodeData = _qrGenerator.CreateQrCode(qrData, QRCodeGenerator.ECCLevel.Q);
            var qrCode = new PngByteQRCode(qrCodeData);
            var qrCodeImage = qrCode.GetGraphic(20);

            return File(qrCodeImage, "image/png");
        }

        // POST: api/bookings
        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking(BookingRequest request)
        {
            // Check if seat is already booked
            var existingBooking = await _context.Bookings
                .FirstOrDefaultAsync(b => b.BusID == request.BusID && 
                                         b.SeatNumber == request.SeatNumber &&
                                         (b.Status == "Confirmed" || b.Status == "Boarded"));

            if (existingBooking != null)
            {
                return BadRequest(new { message = "This seat is already booked. Please select another seat." });
            }

            // Check if passenger exists
            var passenger = await _context.Passengers
                .FirstOrDefaultAsync(p => p.Email == request.PassengerEmail || p.Phone == request.PassengerPhone);

            if (passenger == null)
            {
                passenger = new Passenger
                {
                    FullName = request.PassengerName,
                    Email = request.PassengerEmail,
                    Phone = request.PassengerPhone
                };
                _context.Passengers.Add(passenger);
                await _context.SaveChangesAsync();
            }

            // Create booking
            var booking = new Booking
            {
                PassengerID = passenger.PassengerID,
                BusID = request.BusID,
                FromStopName = request.FromStopName,
                ToStopName = request.ToStopName,
                SeatNumber = request.SeatNumber,
                BookingDate = DateTime.Now,
                Status = "Confirmed"
            };

            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            // Return booking with details
            var bookingDetails = await _context.Bookings
                .Include(b => b.Passenger)
                .Include(b => b.Bus)
                .FirstOrDefaultAsync(b => b.BookingID == booking.BookingID);

            // Send real-time update
            await _hubContext.Clients.All.SendAsync("BookingCreated", booking.BookingID);

            // Send email confirmation
            await _emailService.SendBookingConfirmationAsync(booking);

            return Ok(new { 
                message = "Booking created successfully", 
                booking = bookingDetails 
            });
        }

        // PUT: api/bookings/5/status
        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] string status)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            booking.Status = status;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking status updated successfully" });
        }

        // DELETE: api/bookings/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var booking = await _context.Bookings.FindAsync(id);
            if (booking == null)
            {
                return NotFound();
            }

            _context.Bookings.Remove(booking);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Booking deleted successfully" });
        }

        private string GenerateBookingEmailContent(Booking booking)
        {
            // Implementation
            return "";
        }
    }

    public class BookingRequest
    {
        public int BusID { get; set; }
        public string FromStopName { get; set; }
        public string ToStopName { get; set; }
        public int SeatNumber { get; set; }
        public string PassengerName { get; set; }
        public string PassengerEmail { get; set; }
        public string PassengerPhone { get; set; }
    }
}