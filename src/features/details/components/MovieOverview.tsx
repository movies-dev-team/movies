import { useState } from "react";
import type { MovieDetail } from "../types/movieDetail";
import content from "@/data/content.json";

interface MovieOverviewProps {
  overview: MovieDetail["overview"];
}

export default function MovieOverview({overview}: MovieOverviewProps) {

  const [isExpanded, setIsExpanded] = useState(false);
  const hasLongOverview = overview.length > 150;

  return (
    <section className="mt-4" aria-labelledby="overview-title">
      <h2 className="mb-1 text-xl font-semibold md:text-3xl" id="overview-title">
          {content.movieDetail.overview}
      </h2>
      <p className={`text-sm leading-relaxed
          ${hasLongOverview && !isExpanded? "max-h-40 overflow-hidden" : ""}`}
      >
        {overview}
      </p>
      {hasLongOverview && (
        <button
        type="button"
        aria-expanded={isExpanded}
        className="mt-1 cursor-pointer text-sm font-semibold text-brand-light hover:underline"
        onClick={() => setIsExpanded((previous) => !previous)}
        >
          {isExpanded ? content.loading.readLess : content.loading.readMore}
        </button>)}
    </section>
  )
}