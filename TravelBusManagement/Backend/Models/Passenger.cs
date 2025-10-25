using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Passenger
    {
        [Key]
        public int PassengerID { get; set; }
        
        [Required]
        public string FullName { get; set; }
        
        [EmailAddress]
        public string Email { get; set; }
        
        [Required]
        public string Phone { get; set; }
        
        public string Password { get; set; }
        
        public ICollection<Booking> Bookings { get; set; }
    }
}