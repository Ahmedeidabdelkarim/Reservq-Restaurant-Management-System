import { Image,Ratio } from 'react-bootstrap';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const ImageSwiper = ({itemImages}) => {
    return (
        <div>
            {/* First Swiper (Single Slide View) */}
            <Swiper
                modules={[Autoplay]}
                slidesPerView={1}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                className='my-5'
            >
                {itemImages.map((image,index) =>(
                <SwiperSlide  key={`main-${index}`}>
                    {/* fix the ratio of images by using Ratio component */}
                    <Ratio aspectRatio="16x9">
                        <Image 
                            src={image} 
                            alt="Food Image" 
                            rounded
                            fluid
                            style={{ objectFit: 'cover' }}
                        />
                    </Ratio>
                </SwiperSlide>
                ))}
               
            </Swiper>

            {/* Second Swiper (Multiple Slides with Space Between) */}
            <Swiper
                modules={[Autoplay]}
                slidesPerView={4}   // Display 4 slides
                spaceBetween={20}   // Adjust space between slides
                centeredSlides={false}  // Ensures slides are centered
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
            >
                {itemImages.map((image,index) =>(
                <SwiperSlide  key={`thumb-${index}`}>
                    {/* fix the ratio of images by using Ratio component */}
                    <Ratio aspectRatio="16x9">
                        <Image 
                            src={image} 
                            alt="Food Image" 
                            rounded
                            fluid
                            style={{ objectFit: 'cover' }}
                        />
                    </Ratio>
            
                </SwiperSlide>
                ))}
               
            </Swiper>
        </div>
    );
}

export default ImageSwiper;
