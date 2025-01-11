// import { useState } from 'react';
// import { ArrowLeft, ArrowRight } from 'lucide-react'; // Import arrows from lucide-react
// import '../css/sponsorCarousel.css'; // Make sure the CSS file is linked correctly

// const carouselItems = [
//   { 
//     title: 'Nike', 
//     slogan: 'Just Do It', 
//     description: 'Creativity in Motion', 
//     backgroundColor: '#E41E26',  // red
//     imageUrl: 'https://via.placeholder.com/300' // Replace with your image URL
//   },
//   { 
//     title: 'Adobe', 
//     slogan: 'Design the Future', 
//     description: 'Technology meets art.',
//     backgroundColor: '#FF3A3A',  // bright red
//     imageUrl: 'https://via.placeholder.com/300'
//   },
//   { 
//     title: 'Spotify', 
//     slogan: 'Sound in Color', 
//     description: 'Inspired by music.',
//     backgroundColor: '#1DB954', // green
//     imageUrl: 'https://via.placeholder.com/300'
//   },
//   { 
//     title: 'Lego', 
//     slogan: 'Building Imagination', 
//     description: 'Creative innovation.',
//     backgroundColor: '#FF5F00', // orange
//     imageUrl: 'https://via.placeholder.com/300'
//   },
//   { 
//     title: 'Moët & Chandon', 
//     slogan: 'Moments of Celebration', 
//     description: 'Luxury and elegance.',
//     backgroundColor: '#8E44AD', // purple
//     imageUrl: 'https://via.placeholder.com/300'
//   },
// ];

// const SponsorCarousel = () => {
//   const [currentIndex, setCurrentIndex] = useState(2); // Start from the 3rd slide (index 2)

//   const handleNext = () => {
//     setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
//   };

//   const handlePrev = () => {
//     setCurrentIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length);
//   };

//   return (
//     <div className="carousel-container">
//       <div className="carousel">
//         {/* Previous Arrow */}
//         <button className="arrow left" onClick={handlePrev}>
//           <ArrowLeft size={30} color="#131313" />
//         </button>

//         {/* Carousel Slides */}
//         <div className="carousel-slides">
//           {carouselItems.map((item, index) => {
//             const isActive = index === currentIndex;
//             const isPrev = index === (currentIndex - 1 + carouselItems.length) % carouselItems.length;
//             const isNext = index === (currentIndex + 1) % carouselItems.length;

//             return (
//               <div
//                 key={index}
//                 className={`carousel-slide ${isActive ? 'active' : ''} ${isPrev ? 'prev' : ''} ${isNext ? 'next' : ''}`}
//                 style={{
//                   transform: isActive ? 'scale(1)' : isPrev || isNext ? 'scale(0.8)' : 'scale(0.6)',
//                   backgroundColor: item.backgroundColor
//                 }}
//               >
//                 <div className="slide-content">
//                   <h3>{item.title}</h3>
//                   <p>{item.slogan}</p>
//                   <p>{item.description}</p>
//                   <img src={item.imageUrl} alt={item.title} />
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Next Arrow */}
//         <button className="arrow right" onClick={handleNext}>
//           <ArrowRight size={30} color="#131313" />
//         </button>
//       </div>

//       {/* Pagination */}
//       <div className="pagination">
//         {carouselItems.map((_, index) => (
//           <span
//             key={index}
//             className={`dot ${currentIndex === index ? 'active' : ''}`}
//             onClick={() => setCurrentIndex(index)}
//           />
//         ))}
//       </div>
//     </div>
//   );
// };


const SponsorCarousel = () => {
  return (
    <div>Carousel 2</div>
  )
}

export default SponsorCarousel;
