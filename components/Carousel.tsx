// "use client";

// // import Slider from "react-slick";
// import Image from "next/image";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// export default function Carousel() {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 600,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 2500,
//     arrows: true,
//     responsive: [
//       {
//         breakpoint: 1024, // laptop
//         settings: {
//           slidesToShow: 1,
//           arrows: true,
//         },
//       },
//       {
//         breakpoint: 768, // tablet
//         settings: {
//           slidesToShow: 1,
//           arrows: false,
//         },
//       },
//       {
//         breakpoint: 480, // mobile
//         settings: {
//           slidesToShow: 1,
//           arrows: false,
//           dots: true,
//         },
//       },
//     ],
//   };

//   return (
//     <div className="w-full max-w-6xl mx-auto my-8 px-4">
//       <Slider {...settings}>
//         <div>
//           <Image
//             src="/images/slide1.jpg"
//             alt="Image 1"
//             width={1600}
//             height={900}
//             className="square-2xl shadow-lg w-full h-auto object-cover"
//           />
//         </div>
//         <div>
//           <Image
//             src="/images/slide2.jpg"
//             alt="Image 2"
//             width={1600}
//             height={900}
//             className="square-2xl shadow-lg w-full h-auto object-cover"
//           />
//         </div>
//         <div>
//           <Image
//             src="/images/slide3.jpg"
//             alt="Image 3"
//             width={1600}
//             height={900}
//             className="square-2xl shadow-lg w-full h-auto object-cover"
//           />
//         </div>
//       </Slider>
//     </div>
//   );
// }
