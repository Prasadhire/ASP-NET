using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Backend.Hubs;
using Backend.Services;
using Backend.Settings;
using SendGrid;
using Backend.Services;
using SendGrid.Helpers.Mail;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("http://localhost:3000")
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

// Add JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Issuer"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// Add JWT service
builder.Services.AddScoped<JwtService>();

// Add SignalR
builder.Services.AddSignalR();

// Add SendGrid configuration
builder.Services.Configure<SendGridSettings>(
    builder.Configuration.GetSection("SendGrid"));
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddSingleton<ISendGridClient>(sp => 
    new SendGridClient(Environment.GetEnvironmentVariable("SENDGRID_API_KEY")));

var app = builder.Build();

// Auto-create database
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        context.Database.EnsureCreated(); // This creates the database automatically
        
        // Seed sample data if no admin exists
        if (!context.Admins.Any())
        {
            Console.WriteLine("Seeding sample data...");
            
            // Add sample admin
            var admin = new Admin { 
                FullName = "Admin User", 
                Email = "admin@travelbus.com", 
                Password = "admin123" 
            };
            context.Admins.Add(admin);

            // Add sample bus
            var bus = new Bus { 
                BusNumber = "GJ05AB1234", 
                BusName = "Shree Travels", 
                TotalSeats = 40, 
                Type = "AC", 
                Status = "Active" 
            };
            context.Buses.Add(bus);
            context.SaveChanges();

            // Add sample route
            var route = new BusRoute { 
                BusID = bus.BusID, 
                Source = "Surat", 
                Destination = "Pune" 
            };
            context.Routes.Add(route);
            context.SaveChanges();

            // Add sample stops
            var stops = new List<Stop>
            {
                new Stop { RouteID = route.RouteID, StopName = "Surat", StopOrder = 1, ArrivalTime = new TimeSpan(8, 0, 0) },
                new Stop { RouteID = route.RouteID, StopName = "Mumbai", StopOrder = 2, ArrivalTime = new TimeSpan(14, 0, 0) },
                new Stop { RouteID = route.RouteID, StopName = "Pune", StopOrder = 3, ArrivalTime = new TimeSpan(18, 0, 0) }
            };
            context.Stops.AddRange(stops);
            
            context.SaveChanges();
            
            Console.WriteLine("Database seeded with sample data!");
            Console.WriteLine("Admin Login: admin@travelbus.com / admin123");
        }
        else
        {
            Console.WriteLine("Database already has data. Skipping seeding.");
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred creating the DB.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Add SignalR hub endpoint
app.MapHub<BookingHub>("/hubs/booking");

app.Run();