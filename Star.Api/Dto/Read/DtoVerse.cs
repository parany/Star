namespace Star.Api.Dto.Read
{
    public class DtoVerse
    {
        public string BookId { get; set; }

        public int Chapter { get; set; }

        public int ParagraphMin { get; set; }

        public int ParagraphMax { get; set; }

        public string Version { get; set; }
    }
}