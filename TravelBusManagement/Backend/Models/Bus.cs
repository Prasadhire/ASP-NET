using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Bus
    {
        [Key]
        public int BusID { get; set; }
        
        [Required]
        public string BusNumber { get; set; } = string.Empty;
        
        [Required]
        public string BusName { get; set; } = string.Empty;
        
        [Required]
        public int TotalSeats { get; set; }
        
        public string Type { get; set; } = "AC";
        public string Status { get; set; } = "Active";
        
        // New properties
        public string Amenities { get; set; } = ""; // comma-separated amenities
        public string SeatConfig { get; set; } = ""; // e.g., "2x2"
        public DateTime? LastMaintenance { get; set; }
        public double Rating { get; set; } = 0.0;
        
        // Navigation properties
        public ICollection<BusRoute> Routes { get; set; } = new List<BusRoute>();
        public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    }
}