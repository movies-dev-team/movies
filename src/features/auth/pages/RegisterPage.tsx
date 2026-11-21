import RegisterForm from "../components/RegisterForm"
import desktopBackground from "@/assets/images/cinea-background-home.webp"
import mobileBackground from "@/assets/images/fondo-cinea-movil.webp"
import logo from "@/assets/images/logo.svg"
import filmIcon from "@/assets/icons/catalog.svg"
import heartIcon from "@/assets/icons/favorites.svg"
import sparkleIcon from "@/assets/icons/sparkle.svg"
import starIcon from "@/assets/icons/star.svg"

const features = [
  {
    icon: filmIcon,
    title: "Explora",
    description: "Historias para cada momento",
  },
  {
    icon: heartIcon,
    title: "Colecciona",
    description: "Películas que te encantan",
  },
  {
    icon: sparkleIcon,
    title: "Descubre",
    description: "Nuevos mundos y talentos",
  },
  {
    icon: starIcon,
    title: "Puntúa",
    description: "Tu valoración cuenta",
  },
]

function RegisterPage() {
  return (
    <main className="relative flex min-h-dvh flex-col overflow-x-hidden px-4 py-5 text-white sm:px-8 lg:items-center lg:justify-center lg:px-12 lg:py-10">

      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat lg:hidden"
        style={{
          backgroundImage: `url(${mobileBackground})`,
        }}
      />

      <div
        className="absolute inset-0 hidden bg-cover bg-center bg-no-repeat lg:block"
        style={{
          backgroundImage: `url(${desktopBackground})`,
        }}
      />

      <div className="absolute inset-0 bg-slate-950/35" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">

        <section className="flex w-full flex-col items-center text-center lg:items-start lg:text-left">

          <div className="mb-5 flex w-full items-center justify-center lg:mb-8 lg:justify-start">
            <img
              src={logo}
              alt="CINEA"
              className="h-16 w-auto translate-x-8 sm:h-20 lg:translate-x-0"
            />
          </div>

          <div className="w-full text-center lg:text-left">
            <h1 className="mx-auto max-w-md text-xl leading-tight font-bold sm:text-3xl lg:mx-0 lg:max-w-none lg:text-4xl">
              Tu próximo gran descubrimiento empieza aquí.
            </h1>

            <p className="mx-auto mt-3 max-w-md text-sm leading-snug text-gray-200 sm:text-base lg:mx-0 lg:mt-5 lg:max-w-none lg:text-lg">
              Explora películas, descubre historias y crea tu colección personal.
            </p>
          </div>

          <div className="mt-6 grid w-full grid-cols-4 gap-2 lg:mt-12 lg:gap-4">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex min-w-0 flex-col items-center gap-1 text-center lg:gap-2"
              >
                <img
                  src={feature.icon}
                  alt=""
                  className="h-6 w-6 object-contain lg:h-10 lg:w-10"
                />

                <h2 className="text-[12px] font-bold sm:text-sm lg:text-base">
                  {feature.title}
                </h2>

                <p className="text-[12px] leading-tight text-gray-200 sm:text-[11px] lg:text-base">
                  {feature.description}
                </p>
              </div>
            ))}

          </div>
        </section>

        <div className="mt-auto w-full pt-20 sm:pt-56 lg:mt-0 lg:pt-0">
          <RegisterForm />
        </div>

      </div>
    </main>
  )
}

export default RegisterPage