using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Booking
    {
        [Key]
        public int BookingID { get; set; }
        
        [Required]
        public int PassengerID { get; set; }
        
        [Required]
        public int BusID { get; set; }
        
        [Required]
        public string FromStopName { get; set; } = string.Empty;
        
        [Required]
        public string ToStopName { get; set; } = string.Empty;
        
        [Required]
        public int SeatNumber { get; set; }
        
        public DateTime BookingDate { get; set; } = DateTime.Now;
        public string Status { get; set; } = "Confirmed";
        
        public decimal Amount { get; set; }
        
        public Passenger Passenger { get; set; } = null!;
        public Bus Bus { get; set; } = null!;
    }
}