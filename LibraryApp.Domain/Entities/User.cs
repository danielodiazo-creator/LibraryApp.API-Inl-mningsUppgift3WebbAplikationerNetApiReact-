using System;
using System.Collections.Generic;
using System.Text;

namespace LibraryApp.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }

        public string Username { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string Role { get; set; } = "User";
        public List<Loan> Loans { get; set; }




    }
}
