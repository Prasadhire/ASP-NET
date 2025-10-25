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
    public class BusesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BusesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/buses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Bus>>> GetBuses()
        {
            return await _context.Buses.ToListAsync();
        }

        // GET: api/buses/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Bus>> GetBus(int id)
        {
            var bus = await _context.Buses
                .Include(b => b.Routes)
                .ThenInclude(r => r.Stops)
                .FirstOrDefaultAsync(b => b.BusID == id);

            if (bus == null)
            {
                return NotFound();
            }

            return bus;
        }

        // GET: api/buses/search?source=Surat&destination=Mumbai
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<object>>> SearchBuses(string source, string destination)
        {
            if (string.IsNullOrEmpty(source) || string.IsNullOrEmpty(destination))
            {
                return BadRequest("Source and destination are required");
            }

            var availableBuses = await _context.Buses
                .Include(b => b.Routes)
                    .ThenInclude(r => r.Stops)
                .Where(b => b.Status == "Active" &&
                    b.Routes.Any(r => 
                        r.Stops.Any(s => s.StopName.Contains(source)) &&
                        r.Stops.Any(s => s.StopName.Contains(destination))
                    ))
                .Select(b => new
                {
                    b.BusID,
                    b.BusNumber,
                    b.BusName,
                    b.TotalSeats,
                    b.Type,
                    b.Status,
                    Route = b.Routes.FirstOrDefault(),
                    Stops = b.Routes.SelectMany(r => r.Stops).ToList()
                })
                .ToListAsync();

            return Ok(availableBuses);
        }

        // POST: api/buses
        [HttpPost]
        public async Task<ActionResult<Bus>> CreateBus(Bus bus)
        {
            _context.Buses.Add(bus);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBus), new { id = bus.BusID }, bus);
        }

        // PUT: api/buses/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBus(int id, Bus bus)
        {
            if (id != bus.BusID)
            {
                return BadRequest();
            }

            _context.Entry(bus).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BusExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/buses/5
        [HttpDelete("{id}")]
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

        // GET: api/buses/5/reviews
        [HttpGet("{busId}/reviews")]
        public async Task<ActionResult<IEnumerable<Review>>> GetBusReviews(int busId)
        {
            // Return reviews for bus
            // ...implementation...
            return Ok(/* reviews */);
        }

        // POST: api/buses/5/reviews
        [HttpPost("{busId}/reviews")]
        public async Task<IActionResult> AddBusReview(int busId, [FromBody] Review review)
        {
            // Add review for bus
            // ...implementation...
            return Ok();
        }

        private bool BusExists(int id)
        {
            return _context.Buses.Any(e => e.BusID == id);
        }
    }
}