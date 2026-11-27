import { supabase } from "@/lib/supabaseClient"

export async function getFavorites() {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error("Usuario no autenticado")

  const { data, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("user_id", user.id)

  if (error) throw error

  return data
}

export async function addFavorite(movieId: number) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error("Usuario no autenticado")

  const { data, error } = await supabase
    .from("favorites")
    .insert({
      user_id: user.id,
      movie_id: movieId,
    })
    .select()
    .single()

  if (error) throw error

  return data
}

export async function removeFavorite(movieId: number) {
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError) throw authError
  if (!user) throw new Error("Usuario no autenticado")

  const { error } = await supabase
    .from("favorites")
    .delete()
    .eq("user_id", user.id)
    .eq("movie_id", movieId)

  if (error) throw error
}