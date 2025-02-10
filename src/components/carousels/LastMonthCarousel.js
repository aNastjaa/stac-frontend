import { jsx as _jsx } from "react/jsx-runtime";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Fix Swiper CSS import
import { EffectCoverflow, Pagination } from "swiper/modules";
import carouselData from "../../utils/data/dummyPosts";
import PostCard from "../carousels/PostCard";
import "../../css/carousel.css";
const LastMonthCarousel = () => {
    return (_jsx(Swiper, { effect: "coverflow", grabCursor: true, centeredSlides: true, slidesPerView: "auto", coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        }, pagination: true, modules: [EffectCoverflow, Pagination], className: "last-month-swiper", children: carouselData.map((post, index) => (_jsx(SwiperSlide, { className: "carousel-slide", children: _jsx(PostCard, { username: post.username, image: post.image, description: post.description, likesCount: post.likes_count, commentsCount: post.comments_count }) }, index))) }));
};
export default LastMonthCarousel;
