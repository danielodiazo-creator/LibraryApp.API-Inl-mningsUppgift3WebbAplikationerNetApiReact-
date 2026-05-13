using System;
using System.Collections.Generic;
using System.Text;

namespace LibraryApp.Application.DTOs
{
    public class UpdateBookDto
    {
        public string Title { get; set; }
        public string Author { get; set; }
        public bool isAvailable { get; set; }


    }
}
