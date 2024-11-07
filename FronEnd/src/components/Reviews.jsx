import React, { useRef, useState, useEffect, useContext } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';


// import required modules
import { FreeMode } from 'swiper/modules';
import { WindowWidthContext } from '../context/WindowWidthContext';

function Reviews() {

    const { isMobile } = useContext(WindowWidthContext);

    const [reviews, setReviews] = useState([]);

    const reviewsData = [
        {
            name: "Alice Johnson",
            review: "An excellent course that exceeded my expectations! The instructor’s explanations were very clear, breaking down complex concepts with real-world examples that made everything so much easier to understand. I particularly appreciated the interactive elements, which helped reinforce each topic. Highly recommend this to both beginners and those looking to strengthen their knowledge."
        },
        {
            name: "Michael Smith",
            review: "This course was incredibly thorough, covering everything I needed to get started with confidence. The instructor presented the material in a logical and easily digestible manner, making challenging topics accessible. I learned so much, and the Q&A sections were a fantastic bonus, addressing common issues. It’s clear that a lot of thought went into crafting this curriculum."
        },
        {
            name: "Samantha Lee",
            review: "Great content with a very intuitive structure. While the lectures were detailed, I would have liked a few more hands-on projects to practice independently. That said, the resources provided are top-notch, and I feel far more comfortable tackling real-world applications after completing this course. Overall, it’s a comprehensive learning experience."
        },
        {
            name: "David Kim",
            review: "A fantastic course that delves deeply into the material, providing valuable insights into industry practices and efficient coding techniques. The instructor’s passion for the subject really shines through, and I appreciate how accessible they made advanced topics. I feel well-prepared to apply these skills in a professional setting thanks to this course."
        },
        {
            name: "Emma Brown",
            review: "This course was exactly what I needed. The curriculum was well-organized and allowed me to progress at a comfortable pace, ensuring I retained each concept. The projects and quizzes were excellent for testing knowledge and helped build my confidence. A must-take for anyone serious about expanding their skills."
        },
        {
            name: "Lucas Garcia",
            review: "I enjoyed the course thoroughly. The instructor’s pacing and clarity in explanations were spot-on, making even the most complex sections approachable. It’s rare to find courses that maintain quality from start to finish, but this one delivered. I feel much more equipped with a solid foundation in the subject."
        },
        {
            name: "Olivia Martinez",
            review: "Solid course, but some sections felt a bit rushed, especially toward the end. While I appreciated the challenging content, I would have preferred a few additional practice exercises to ensure I grasped each concept fully. Still, a worthwhile experience with valuable content and insights."
        },
        {
            name: "James Wilson",
            review: "The quizzes and assignments were challenging, but they significantly boosted my confidence. Each section built upon the previous one, creating a cohesive learning path. The knowledge checks were invaluable for highlighting areas where I needed to focus. This course gave me an in-depth understanding of the topic that I haven’t found elsewhere."
        },
        {
            name: "Sophia Anderson",
            review: "Very insightful course that exceeded my expectations. The instructor’s explanations were clear, and I appreciated the examples, which were easy to follow and directly applicable. The course has equipped me with both foundational knowledge and practical skills that I am already applying in real projects."
        },
        {
            name: "Benjamin Thomas",
            review: "An exceptional course with great depth and practical exercises. The material was presented in a very structured manner, allowing for a step-by-step understanding. The real-life examples and hands-on projects truly bridged the gap between theory and practice. I came out of this course feeling confident and prepared to tackle complex projects."
        }
    ];


    useEffect(() => {
        setReviews(reviewsData);
    }, [])



    return (
        <>
            <Swiper
                slidesPerView={`${isMobile ? 1 : 3}`}
                spaceBetween={30}
                freeMode={true}

                modules={[FreeMode]}
                className="text-gray w-full cursor-move"
            >

                {
                    reviews.map((review, index) => {
                        return <SwiperSlide key={index}
                            className='w-full bg-gradientForBorder p-2 rounded-lg'
                        >
                            <div className='border border-border bg-bgTwo p-6 sm:p-10 h-fit sm:h-screen rounded-md'>
                                <h4 className='text-white font-semibold text-base sm:text-xl mb-2 sm:mb-4'>{review.name}</h4>
                                <p className='text-sm sm:text-base'>{review.review}</p>
                            </div>
                        </SwiperSlide>
                    })
                }
            </Swiper>
        </>
    );


}

export default Reviews