using Microsoft.AspNetCore.SignalR;

namespace Backend.Hubs
{
    public class BookingHub : Hub
    {
        public async Task UpdateBookingStatus(string bookingId, string status)
        {
            await Clients.All.SendAsync("ReceiveBookingUpdate", bookingId, status);
        }

        public async Task UpdateSeatAvailability(string busId, List<int> occupiedSeats)
        {
            await Clients.All.SendAsync("ReceiveSeatUpdate", busId, occupiedSeats);
        }
    }
}
