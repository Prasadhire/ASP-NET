using SendGrid;
using SendGrid.Helpers.Mail;
using Microsoft.Extensions.Configuration;
using Backend.Models;

namespace Backend.Services
{
    public interface IEmailService
    {
        Task<bool> SendEmailAsync(string toEmail, string subject, string content);
        Task<bool> SendBookingConfirmationAsync(Booking booking);
    }

    public class EmailService : IEmailService
    {
        private readonly ISendGridClient _sendGridClient;
        private readonly IConfiguration _configuration;

        public EmailService(ISendGridClient sendGridClient, IConfiguration configuration)
        {
            _sendGridClient = sendGridClient;
            _configuration = configuration;
        }

        public async Task<bool> SendEmailAsync(string toEmail, string subject, string content)
        {
            var from = new EmailAddress(_configuration["SendGrid:FromEmail"], _configuration["SendGrid:FromName"]);
            var to = new EmailAddress(toEmail);
            var msg = MailHelper.CreateSingleEmail(from, to, subject, content, content);
            
            var response = await _sendGridClient.SendEmailAsync(msg);
            return response.IsSuccessStatusCode;
        }

        public async Task<bool> SendBookingConfirmationAsync(Booking booking)
        {
            var subject = $"Booking Confirmation - Booking ID: {booking.BookingId}";
            var content = $@"Dear {booking.Passenger.FullName},

Thank you for booking with Travel Bus Management.

Booking Details:
- Booking ID: {booking.BookingId}
- From: {booking.FromStopName}
- To: {booking.ToStopName}
- Travel Date: {booking.BookingDate}
- Number of Seats: {booking.NumberOfSeats}
- Total Amount: {booking.TotalFare}

Have a safe journey!

Best regards,
Travel Bus Management";

            return await SendEmailAsync(booking.Passenger.Email, subject, content);
        }
    }
}
