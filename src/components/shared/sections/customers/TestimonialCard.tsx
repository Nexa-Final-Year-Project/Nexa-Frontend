import { StarIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/solid";

type Testimonial = {
  id: number;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
};

export const TestimonialCard = ({
  testimonial,
}: {
  testimonial: Testimonial;
}) => {
  return (
    <div className="glass-card-xl p-12 h-full">
      <div className="flex items-center mb-8">
        <div className="flex-shrink-0 mr-6">
          <img
            className="h-16 w-16 rounded-full border-2 border-primary/30"
            src={testimonial.avatar}
            alt={testimonial.name}
            loading="lazy"
          />
        </div>
        <div>
          <h4 className="text-xl font-bold text-foreground">
            {testimonial.name}
          </h4>
          <p className="text-muted">{testimonial.role}</p>
          <div className="flex mt-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                className={`h-5 w-5 ${
                  i < testimonial.rating ? "text-yellow-400" : "text-muted/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      <blockquote className="relative">
        <div className="absolute -top-8 -left-8 h-16 w-16 text-primary/10">
          <ChatBubbleLeftRightIcon className="h-full w-full" />
        </div>
        <p className="text-xl leading-relaxed text-foreground/90 pl-12">
          {testimonial.content}
        </p>
      </blockquote>
    </div>
  );
};
