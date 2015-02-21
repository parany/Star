using System.Collections.Generic;
using Star.Model.Models.Write;

namespace Star.Api.Dto.Write
{
    public class DtoTreaty
    {
        public List<Treaty> Treaties { get; set; }

        public string Prev { get; set; }

        public string Next { get; set; }
    }
}