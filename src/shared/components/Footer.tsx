import footerBackground from "./cinea-footer-desktop.webp"
import logo from "@/assets/images/logo.svg"
import content from "@/data/content.json"

export default function Footer() {
  return (
    <footer className="relative hidden w-full overflow-hidden text-white lg:block">
      <div
        className="absolute inset-0 bg-cover bg-position-[50%_37%] bg-no-repeat"
        style={{ backgroundImage: `url(${footerBackground})` }}
      />

      <div className="relative z-10">
        <div className="flex min-h-28 items-end justify-between px-10 pb-3 pt-10">
          <div>
            <img
              src={logo}
              alt={content.footer.brand}
              className="ml-30 w-32"
            />

            <p className="mt-1 text-sm">
              {content.footer.description}
            </p>
          </div>

          <div className="text-right">
            <div className="flex items-center justify-end gap-2">
              <span className="text-lg font-bold tracking-wider text-cyan-400">
                {content.footer.provider.name}
              </span>

              <span className="h-3 w-8 rounded-full bg-cyan-400" />
            </div>

            <p className="mt-1 text-sm">
              {content.footer.provider.description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-purple-500/40 bg-black/30 px-10 py-3 text-sm">
          <p>© {new Date().getFullYear()} {content.footer.copyright}</p>

          <p>{content.footer.credits}</p>
        </div>
      </div>
    </footer>
  )
}