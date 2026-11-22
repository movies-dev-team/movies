import { useState, useEffect } from "react";
import type { MovieTrailer } from "../types/movieTrailer";
import { getMovieTrailer } from "../services/movieTrailerService";
import content from '../../../data/content.json'
interface MovieTrailerProps {
  movieId: number;
}

export default function MovieTrailer({movieId}: MovieTrailerProps ) {

  const [trailer, setTrailer] = useState<MovieTrailer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {

    let ignore = false;

    async function loadTrailer() {
      setTrailer(null);
      setLoading(true);
      setError(false);

      try {
        const data = await getMovieTrailer(movieId);
        console.log('Detalle de trailer:', data);
          if (!ignore) {
          setTrailer(data);
        }

      } catch (error) {
          if (!ignore) {
            setError(true);
            console.error(error);
          } 
      } finally {
          if (!ignore) {
          setLoading(false);
           }  
      }
    }
    loadTrailer();
    return () => {
      ignore = true;
    };
  }, [movieId]);

if (loading) {
    return <p>{content.loading.trailer}</p>;
  }
  if (error) {
    return <p>{content.errors.generic}</p>
  } 
  if (!trailer) { 
    return <p>{content.movieDetail.noTrailer}</p>
  }

  return (
    <iframe
    className="w-full aspect-video rounded-xl"
    src={`https://www.youtube-nocookie.com/embed/${trailer.key}`}
    title={trailer.name}
    allowFullScreen
    loading="lazy"
    />
    
  )
}





