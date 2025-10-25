using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class BusRoute
    {
        [Key]
        public int RouteID { get; set; }
        
        [Required]
        public int BusID { get; set; }
        
        [Required]
        public string Source { get; set; } = string.Empty;
        
        [Required]
        public string Destination { get; set; } = string.Empty;
        
        // Navigation properties
        public Bus Bus { get; set; } = null!;
        public ICollection<Stop> Stops { get; set; } = new List<Stop>();
    }
}