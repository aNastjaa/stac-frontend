import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Fix Swiper CSS import
import { EffectCoverflow, Pagination } from "swiper/modules";
import carouselData from "../../utils/data/dummyPosts";
import PostCard from "../carousels/PostCard";
import "../../css/carousel.css";

const LastMonthCarousel = () => {
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
      className="last-month-swiper"
    >
      {carouselData.map((post, index) => (
        <SwiperSlide key={index} className="carousel-slide">
          <PostCard
            username={post.username}
            image={post.image}
            description={post.description}
            likesCount={post.likes_count}
            commentsCount={post.comments_count}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default LastMonthCarousel;
