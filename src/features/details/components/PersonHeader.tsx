import type { PersonDetail } from "../types/personDetail";
import content from "@/data/content.json";
import { formatDate } from "@/shared/utils/formatDate";

interface PersonHeaderProps {
  person: PersonDetail;
}

export default function PersonHeader({person}: PersonHeaderProps) {
  return (
    <>
      <div className="col-span-2 md:col-span-1 md:row-span-2">
        {person.profile_path && ( <img
          className="aspect-[2/3] w-full max-w-[160px] md:max-w-xs rounded-xl object-cover"
          src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
          alt={`${content.movieDetail.pictureOf} ${person.name}`}
          />
        )}
      </div>
      <div className="col-span-3 min-w-0 md:col-span-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          {person.name}
        </h1>
        <div className="mt-3 flex flex-col gap-2">
          {person.birthday && (
          <p className="text-sm leading-5 text-text-secondary">
            {content.movieDetail.birthDate}:{" "} 
            <time dateTime={person.birthday}>
              {formatDate(person.birthday)}
            </time>
          </p>
          )}
          {person.place_of_birth && (
          <p className="text-sm leading-5 text-text-secondary">
            {content.movieDetail.birthPlace}:{" "} {person.place_of_birth}
          </p>
          )}
        </div>  
      </div> 
    </>
  )
}