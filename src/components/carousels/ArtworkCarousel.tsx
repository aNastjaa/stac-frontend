import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";  // Fix Swiper CSS import
import { EffectCoverflow, Pagination } from "swiper/modules";
import ArtworkCard from "../../components/artworks/ArtworkCard";  // Assuming ArtworkCard is located in the same directory
import { ArtworkResponse } from "../../utils/types";  // Assuming ArtworkResponse is defined in utils/types
import "../../css/carousel.css";  // Carousel CSS for styling

interface ArtworkCarouselProps {
  artworks: ArtworkResponse[];  // artworks prop passed from the parent
  userId: string;
  isPending?: boolean;
}

const ArtworkCarousel = ({ artworks, userId, isPending }: ArtworkCarouselProps) => {
  return (
    <Swiper
      effect={"coverflow"}
      grabCursor={true}
      centeredSlides={true}
      slidesPerView={"auto"}
      coverflowEffect={{
        rotate: 50,
        stretch: 0,
        depth: 100,
        modifier: 1,
        slideShadows: true,
      }}
      pagination={true}
      modules={[EffectCoverflow, Pagination]}
      className="artwork-swiper"
    >
      {artworks.map((artwork) => (
        <SwiperSlide key={artwork.id} className="carousel-slide">
          <ArtworkCard
            artwork={artwork}
            userId={userId}
            isPending={isPending}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ArtworkCarousel;
