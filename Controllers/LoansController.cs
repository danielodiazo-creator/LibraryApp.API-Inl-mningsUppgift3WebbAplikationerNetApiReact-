using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using LibraryApp.Infrastructure.Data;
using LibraryApp.Domain.Entities;
using LibraryApp.Application.DTOs;

namespace LibraryApp.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoansController : ControllerBase
    {
        private readonly AppDbContext _context;

        public LoansController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> BorrowBook(LoanDto dto)
        {
            var email = User.FindFirst(ClaimTypes.Name)?.Value;

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return Unauthorized();

            var loan = new Loan
            {
                UserId = user.Id,
                BookId = dto.BookId,
                LoanDate = DateTime.UtcNow,
                IsReturned = false,
                ReturnDate = null
            };

            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpPost("return/{id}")]
        public async Task<IActionResult> ReturnBook(int id)
        {
            var loan = await _context.Loans.FirstOrDefaultAsync(l => l.Id == id);

            if (loan == null)
                return NotFound();

            loan.IsReturned = true;
            loan.ReturnDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok();
        }

        [Authorize]
        [HttpGet("my")]
        public async Task<IActionResult> GetMyLoans()
        {
            var email = User.FindFirst(ClaimTypes.Name)?.Value;

            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return Unauthorized();

            var loans = await _context.Loans
                .Include(l => l.Book)
                .Where(l => l.UserId == user.Id && !l.IsReturned)
                .Select(l => new
                {
                    l.Id,
                    l.BookId,
                    BookTitle = l.Book.Title,
                    l.LoanDate,
                    l.IsReturned
                })
                .ToListAsync();

            return Ok(loans);
        }

    }
}