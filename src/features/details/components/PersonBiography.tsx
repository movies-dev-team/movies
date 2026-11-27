import { useState } from "react";
import type { PersonDetail } from "../types/personDetail";
import content from "@/data/content.json";

interface PersonBiographyProps {
  biography: PersonDetail["biography"];
}

export default function PersonBiography({ biography }: PersonBiographyProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasLongBiography = biography.length > 300;

  return (
    <section
      className="col-span-5 min-w-0 md:col-span-2"
      aria-labelledby="biography-title"
    >
      <h2
        id="biography-title"
        className="mb-2 text-xl font-semibold md:text-2xl"
      >
        {content.movieDetail.biography}
      </h2>

      <p
        id="person-biography"
        className={`text-sm leading-7 text-text-secondary whitespace-pre-line md:text-base
          ${hasLongBiography && !isExpanded ? "max-h-40 overflow-hidden" : ""}`}
      >
        {biography.trim()
          ? biography
          : content.movieDetail.biographyNotAvailable}
      </p>

      {hasLongBiography && (
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls="person-biography"
          className="mt-2 cursor-pointer text-sm font-semibold text-brand-light hover:underline
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-light"
          onClick={() => setIsExpanded((previous) => !previous)}
        >
          {isExpanded ? content.loading.readLess : content.loading.readMore}
        </button>
      )}
    </section>
  );
}
