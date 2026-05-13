using System;
using System.Collections.Generic;
using System.Text;

namespace LibraryApp.Domain.Entities
{
    public class Book
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Author { get; set; }
        public bool IsAvailable { get; set; } = true;

        public List<Loan> Loans { get; set; }   

    }
}
