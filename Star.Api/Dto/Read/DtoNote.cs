using System.Collections.Generic;
using Star.Model.Models.Core;
using Star.Model.Models.Read;

namespace Star.Api.Dto.Read
{
    public class DtoNote
    {
        public Note Note { get; set; }

        public List<Tag> Tags { get; set; } 
    }
}