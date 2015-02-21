using System.Collections.Generic;
using Star.Model.Models.Read;

namespace Star.Api.Dto.Read
{
    public class DtoNotes
    {
        public Note MyNote { get; set; }

        public List<Note> OtherNotes { get; set; } 
    }
}