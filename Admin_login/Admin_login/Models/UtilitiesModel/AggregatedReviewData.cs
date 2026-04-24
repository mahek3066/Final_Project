namespace Admin_login.Utilities
{
    public class AggregatedReviewData
    {
        public Guid ProductId { get; set; }
        public int RatingCount { get; set; }
        public int RatingCountWithoutTitle { get; set; }
        public int ActiveReviewCount { get; set; }
        public int InactiveReviewCount { get; set; }
        public double AvgRating { get; set; }
       
    }
}
