import { useEffect, useState } from "react"
import { getUserProfile } from "../services/profileService"
import content from "@/data/content.json"

interface Profile {
  username: string
  email: string | undefined
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getUserProfile()
        setProfile(data)
      } catch {
        setError(content.profile.loadError)
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  return { profile, loading, error }
}