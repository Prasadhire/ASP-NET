using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Review
    {
        [Key]
        public int ReviewID { get; set; }
        
        public int BusID { get; set; }
        public Bus Bus { get; set; }
        
        public int PassengerID { get; set; }
        public Passenger Passenger { get; set; }
        
        [Required]
        public int Rating { get; set; }
        
        [MaxLength(500)]
        public string Comment { get; set; }
        
        public DateTime ReviewDate { get; set; } = DateTime.Now;
    }
}
