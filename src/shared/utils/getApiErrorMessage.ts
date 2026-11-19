import axios from "axios";
import content from "@/data/content.json";

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return content.errors.network;
    }

    if (error.response.status === 404) {
      return content.errors.notFound;
    }

    if (error.response.status >= 500) {
      return content.errors.server;
    }
  }

  return content.errors.generic;
}
