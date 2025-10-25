using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Data;
using ClosedXML.Excel;
using iText.Kernel.Pdf;
using iText.Layout;
using iText.Layout.Element;
using System.Text;
using Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "admin")]
    public class ReportingController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ReportingController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/reporting/revenue
        [HttpGet("revenue")]
        public async Task<ActionResult<object>> GetRevenueReport([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var revenueData = await _context.Bookings
                .Include(b => b.Bus)
                .Where(b => b.BookingDate >= startDate && b.BookingDate <= endDate)
                .GroupBy(b => b.BookingDate.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    TotalBookings = g.Count(),
                    Revenue = g.Sum(b => b.Bus.Type == "AC" ? 800 : 500),
                    ACBookings = g.Count(b => b.Bus.Type == "AC"),
                    NonACBookings = g.Count(b => b.Bus.Type != "AC")
                })
                .ToListAsync();

            return Ok(revenueData);
        }

        // GET: api/reporting/export/excel
        [HttpGet("export/excel")]
        public async Task<IActionResult> ExportToExcel([FromQuery] string reportType)
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add("Report");

            // Add headers and data based on report type
            switch (reportType.ToLower())
            {
                case "revenue":
                    await ExportRevenueReport(worksheet);
                    break;
                case "bookings":
                    await ExportBookingsReport(worksheet);
                    break;
                // Add more report types as needed
            }

            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            stream.Position = 0;

            return File(
                stream.ToArray(),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"{reportType}_report_{DateTime.Now:yyyyMMdd}.xlsx"
            );
        }

        private async Task ExportRevenueReport(IXLWorksheet worksheet)
        {
            var data = await _context.Bookings
                .Include(b => b.Bus)
                .GroupBy(b => b.BookingDate.Date)
                .Select(g => new
                {
                    Date = g.Key,
                    Revenue = g.Sum(b => b.Bus.Type == "AC" ? 800 : 500),
                    BookingCount = g.Count()
                })
                .ToListAsync();
                
            // Add headers
            worksheet.Cell(1, 1).Value = "Date";
            worksheet.Cell(1, 2).Value = "Revenue";
            worksheet.Cell(1, 3).Value = "Booking Count";

            // Add data
            int row = 2;
            foreach (var item in data)
            {
                worksheet.Cell(row, 1).Value = item.Date.ToString("yyyy-MM-dd");
                worksheet.Cell(row, 2).Value = item.Revenue;
                worksheet.Cell(row, 3).Value = item.BookingCount;
                row++;
            }
        }

        private async Task ExportBookingsReport(IXLWorksheet worksheet)
        {
            var bookings = await _context.Bookings
                .Include(b => b.Bus)
                .Include(b => b.Passenger)
                .ToListAsync();

            // Add implementation
        }
    }
}
