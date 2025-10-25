using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Admin> Admins { get; set; }
        public DbSet<Bus> Buses { get; set; }
        public DbSet<BusRoute> Routes { get; set; }
        public DbSet<Stop> Stops { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Passenger> Passengers { get; set; }
        public DbSet<Conductor> Conductors { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Notification> Notifications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configure relationships
            modelBuilder.Entity<BusRoute>()
                .HasOne(r => r.Bus)
                .WithMany(b => b.Routes)
                .HasForeignKey(r => r.BusID);

            modelBuilder.Entity<Stop>()
                .HasOne(s => s.Route)
                .WithMany(r => r.Stops)
                .HasForeignKey(s => s.RouteID);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Passenger)
                .WithMany(p => p.Bookings)
                .HasForeignKey(b => b.PassengerID);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Bus)
                .WithMany(b => b.Bookings)
                .HasForeignKey(b => b.BusID);

            modelBuilder.Entity<Conductor>()
                .HasOne(c => c.AssignedBus)
                .WithMany()
                .HasForeignKey(c => c.AssignedBusID);

            base.OnModelCreating(modelBuilder);
        }
    }
}