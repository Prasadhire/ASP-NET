using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class IncidentReport
    {
        [Key]
        public int IncidentID { get; set; }
        
        public int BusID { get; set; }
        public Bus Bus { get; set; }
        
        public int ConductorID { get; set; }
        public Conductor Conductor { get; set; }
        
        [Required]
        public string IncidentType { get; set; }
        
        [Required]
        public string Description { get; set; }
        
        public DateTime IncidentDate { get; set; } = DateTime.Now;
        
        public string Status { get; set; } = "Reported";
    }
}
