import { jsx as _jsx } from "react/jsx-runtime";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css"; // Fix Swiper CSS import
import { EffectCoverflow, Pagination } from "swiper/modules";
import ArtworkCard from "../../components/artworks/ArtworkCard"; // Assuming ArtworkCard is located in the same directory
import "../../css/carousel.css"; // Carousel CSS for styling
const ArtworkCarousel = ({ artworks, userId, isPending }) => {
    return (_jsx(Swiper, { effect: "coverflow", grabCursor: true, centeredSlides: true, slidesPerView: "auto", coverflowEffect: {
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
        }, pagination: true, modules: [EffectCoverflow, Pagination], className: "artwork-swiper", children: artworks.map((artwork) => (_jsx(SwiperSlide, { className: "carousel-slide", children: _jsx(ArtworkCard, { artwork: artwork, userId: userId, isPending: isPending }) }, artwork.id))) }));
};
export default ArtworkCarousel;
