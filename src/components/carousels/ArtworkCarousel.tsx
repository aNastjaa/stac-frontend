import { useEffect, useState } from "react";
import ArtworkCard from '../../components/artworks/ArtworkCard';
import "../../css/carousel.css";  // CSS for the carousel styling

interface Submission {
  id: string;
  username: string;
  image: string;
  likesCount: number;
  commentsCount: number;
}

const ArtworkCarousel = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch submissions data
  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await fetch("/api/submissions"); // Adjust the endpoint as needed
        const data = await response.json();
        setSubmissions(data);
      } catch (error) {
        console.error("Error fetching submissions:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSubmissions();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="carousel-container">
      {submissions.map((submission, index) => (
        <div
          key={submission.id}
          className={`carousel-slide ${index === 1 ? "center" : "side"}`} // Center the middle slide
        >
          <ArtworkCard
            username={submission.username}
            image={submission.image}
            likesCount={submission.likesCount}
            commentsCount={submission.commentsCount}
          />
        </div>
      ))}
    </div>
  );
};

export default ArtworkCarousel;
