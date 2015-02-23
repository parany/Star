using System.Collections.Generic;
using Star.Model.Models.Write;

namespace Star.Api.Dto.Write
{
    public class DtoNew
    {
        public List<New> News { get; set; }

        public string Prev { get; set; }

        public string Next { get; set; }
    }
}