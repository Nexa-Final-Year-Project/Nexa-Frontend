import { AnimatedDiv } from "../../AnimatedDiv";

type HighlightItem = {
  title: string;
  description: string;
  image: string;
  floatElement?: {
    image: string;
    alt: string;
    position: "left" | "right" | "top" | "bottom";
  };
};

export const FeatureHighlight = ({ items }: { items: HighlightItem[] }) => (
  <>
    {items.map((item, index) => (
      <AnimatedDiv
        key={index}
        variant="fade"
        delay={0.6 + index * 0.2}
        className="glass-card p-8 mt-20"
      >
        <div className="w-full">
          <div
            className={`lg:grid lg:grid-cols-2 lg:gap-8 place-items-center ${
              index % 2 === 0 ? "" : "lg:grid-flow-dense"
            }`}
          >
            {/* Text Content - Alternates sides */}
            <div
              className={`mb-8 lg:mb-0 ${
                index % 2 === 0 ? "" : "lg:col-start-2"
              }`}
            >
              <h3 className="text-2xl font-extrabold text-foreground sm:text-3xl">
                {item.title}
              </h3>
              <p className="mt-3 text-lg text-muted-foreground">
                {item.description}
              </p>
            </div>

            {/* Image - Alternates sides */}
            <div
              className={`relative ${
                index % 2 === 0 ? "" : "lg:col-start-1 lg:row-start-1"
              }`}
            >
              <img
                className="w-full rounded-lg shadow-lg"
                src={item.image}
                alt="Feature illustration"
              />
              {item.floatElement && (
                <AnimatedDiv
                  variant="fade"
                  direction="down"
                  delay={0.8 + index * 0.2}
                  className={`absolute glass-card-sm p-2
                    ${item.floatElement.position === "right" ? "-right-4" : ""}
                    ${item.floatElement.position === "left" ? "-left-4" : ""}
                    ${item.floatElement.position === "top" ? "-top-4" : ""}
                    ${
                      item.floatElement.position === "bottom" ? "-bottom-4" : ""
                    }
                    ${
                      item.floatElement.position === "right" ||
                      item.floatElement.position === "left"
                        ? "top-1/2 transform -translate-y-1/2"
                        : ""
                    }
                  `}
                >
                  <img
                    src={item.floatElement.image}
                    alt={item.floatElement.alt}
                    className="h-12 w-12"
                  />
                </AnimatedDiv>
              )}
            </div>
          </div>
        </div>
      </AnimatedDiv>
    ))}
  </>
);
