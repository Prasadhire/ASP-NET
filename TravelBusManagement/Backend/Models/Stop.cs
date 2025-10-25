using System.ComponentModel.DataAnnotations;

namespace Backend.Models
{
    public class Stop
    {
        [Key]
        public int StopID { get; set; }
        
        [Required]
        public int RouteID { get; set; }
        
        [Required]
        public string StopName { get; set; }
        
        public int StopOrder { get; set; }
        public TimeSpan ArrivalTime { get; set; }
        
        public BusRoute Route { get; set; }
    }
}