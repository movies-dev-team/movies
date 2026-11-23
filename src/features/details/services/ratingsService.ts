import { supabase } from "@/lib/supabaseClient";

export async function getMovieRating(movieId: number) {
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("Usuario no autenticado");

  const { data, error } = await supabase
    .from("reviews")
    .select("rating")
    .eq("user_id", user.id)
    .eq("movie_id", movieId)
    .maybeSingle();

  if (error) throw error;

  return data?.rating ?? 0;
}

export async function saveMovieRating(movieId: number, rating: number) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 10) {
    throw new Error("La puntuación debe estar entre 1 y 10");
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError) throw authError;
  if (!user) throw new Error("Usuario no autenticado");

  const { error } = await supabase
    .from("reviews")
    .upsert(
      {
        user_id: user.id,
        movie_id: movieId,
        rating,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: "user_id,movie_id",
      }
    );

  if (error) throw error;
}