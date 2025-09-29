"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";
import { AnimatedDiv } from "../../AnimatedDiv";
import { TestimonialCard } from "./TestimonialCard";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "CTO at TechCorp",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    content:
      "NEXA has completely transformed our workflow. The intuitive interface and powerful automation tools have saved us hundreds of hours each month.",
    rating: 5,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Product Director at InnovateX",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    content:
      "Switching to NEXA was the best decision we made last year. The collaboration features are unparalleled, and our team adoption was seamless.",
    rating: 5,
  },
  {
    id: 3,
    name: "Emma Rodriguez",
    role: "CEO at Digital Horizon",
    avatar: "https://randomuser.me/api/portraits/women/46.jpg",
    content:
      "The analytics dashboard alone is worth the investment. We've gained insights that have directly impacted our bottom line by 23% this quarter.",
    rating: 4,
  },
  {
    id: 4,
    name: "David Kim",
    role: "VP Engineering at FutureTech",
    avatar: "https://randomuser.me/api/portraits/men/47.jpg",
    content:
      "NEXA's security features give us peace of mind while collaborating globally. The granular permission controls are exceptional.",
    rating: 5,
  },
];

export const TestimonialCarousel = () => {
  return (
    <AnimatedDiv variant="fade" delay={0.8} className="mt-32">
      <div className="max-w-7xl mx-auto">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={1}
          navigation={{
            nextEl: ".testimonial-next",
            prevEl: ".testimonial-prev",
          }}
          pagination={{
            clickable: true,
            el: ".testimonial-pagination",
            bulletClass: "testimonial-bullet",
            bulletActiveClass: "testimonial-bullet-active",
          }}
          autoplay={{ delay: 8000 }}
          loop={true}
          className="relative"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </SwiperSlide>
          ))}

          <div className="mt-12 pt-6 border-t border-glass-border flex justify-between items-center">
            <div className="flex space-x-4">
              <button className="testimonial-prev glass-card-sm p-3 rounded-full hover:bg-primary/10 transition-colors">
                <ArrowLeftIcon className="h-5 w-5 text-foreground" />
              </button>
              <button className="testimonial-next glass-card-sm p-3 rounded-full hover:bg-primary/10 transition-colors">
                <ArrowRightIcon className="h-5 w-5 text-foreground" />
              </button>
            </div>
            <div className="testimonial-pagination flex gap-2"></div>
          </div>
        </Swiper>
      </div>
    </AnimatedDiv>
  );
};
