import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import notFoundBg from "@/assets/images/not-found-bg.webp";
import content from "@/data/content.json";

export default function NotFoundPage() {
  return (
    <main
      className="relative flex min-h-dvh flex-col items-center justify-between bg-cover bg-center bg-no-repeat px-6 py-40 text-center text-white"
      style={{ backgroundImage: `url(${notFoundBg})` }}
    >
      <div className="absolute inset-0 bg-linear-to from-black/80 via-black/20 to-transparent" />

      <div className="relative z-10">
        <h1 className="text-xl font-bold md:text-xl">
          {content.notFound.title}
        </h1>
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <p className="mb-2 text-xl font-semibold md:text-base">
          {content.notFound.highlight}
        </p>

        <p className="max-w-lg text-sm text-gray-300 md:text-base">
          {content.notFound.description}
        </p>

        <Link to="/" className="mt-8">
          <Button size="lg">{content.notFound.button}</Button>
        </Link>
      </div>
    </main>
  );
}
