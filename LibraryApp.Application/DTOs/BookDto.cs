using System;
using System.Collections.Generic;
using System.Text;

namespace LibraryApp.Application.DTOs
{
    public class BookDto
    {
        public int Id { get; set; }   
        public string Author { get; set; }
        public string Title { get; set; }
        public bool IsAvailable { get; set; }

    }
}
