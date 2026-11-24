import { supabase } from "@/lib/supabaseClient"
import content from "@/data/content.json"

export async function getUserProfile() {
  const { data: authData, error: authError } =
    await supabase.auth.getUser()

  if (authError) throw authError

  const user = authData.user

  if (!user) {
    throw new Error(content.auth.messages.unauthenticated)
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single()

  if (error) throw error

  return {
    username: profile.username,
    email: user.email,
  }
}