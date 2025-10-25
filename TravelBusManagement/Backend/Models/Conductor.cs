using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Conductor
    {
        [Key]
        public int ConductorID { get; set; }
        
        [Required]
        public string FullName { get; set; } = string.Empty;
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string Password { get; set; } = string.Empty;
        
        public int AssignedBusID { get; set; }
        
        // Navigation property
        [ForeignKey("AssignedBusID")]
        public Bus AssignedBus { get; set; } = null!;
    }
}