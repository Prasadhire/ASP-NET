using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Payment
    {
        [Key]
        public int PaymentID { get; set; }
        
        public int BookingID { get; set; }
        public Booking Booking { get; set; }
        
        [Required]
        public decimal Amount { get; set; }
        
        [Required]
        public string PaymentMethod { get; set; }
        
        public string TransactionID { get; set; }
        
        public string Status { get; set; }
        
        public DateTime PaymentDate { get; set; } = DateTime.Now;
    }
}
