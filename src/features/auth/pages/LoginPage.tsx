import LoginForm from "../components/LoginForm"

import desktopBackground from "@/assets/images/cinea-background-home.webp"
import mobileBackground from "@/assets/images/fondo-cinea-movil.webp"
import logo from "@/assets/images/logo.svg"

import filmIcon from "@/assets/icons/catalog.svg"
import heartIcon from "@/assets/icons/favorites.svg"

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
]

function LoginPage() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10 text-white sm:px-8 lg:px-12">

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

      <div className="absolute inset-0 bg-slate-950/45" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">

        <section className="flex flex-col items-center text-center lg:items-start lg:text-left">

          <div className="mb-8 flex items-center">
            <img
              src={logo}
              alt="CINEA"
              className="h-16 w-auto sm:h-20"
            />
          </div>

          <h1 className="mb-5 text-3xl leading-tight font-bold sm:text-4xl lg:text-4xl">
            Tu próximo gran descubrimiento empieza aquí.
          </h1>

          <p className="max-w-xl text-base text-gray-200 sm:text-lg lg:text-xl">
            Explora películas, descubre historias y crea tu colección personal.
          </p>

          <div className="mt-10 grid w-full grid-cols-2 gap-6 sm:mt-12 lg:grid-cols-4 lg:gap-4">

            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex flex-col items-center gap-2 text-center"
              >
                <img
                  src={feature.icon}
                  alt=""
                  className="h-10 w-10"
                />

                <h2 className="text-base font-bold">
                  {feature.title}
                </h2>

                <p className="text-xs text-gray-200">
                  {feature.description}
                </p>
              </div>
            ))}

            <div className="flex flex-col items-center gap-2 text-center">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="42"
                viewBox="0 0 48 42"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="sparklePurple"
                    x1="5"
                    y1="4"
                    x2="43"
                    y2="39"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#C14BFF" />
                    <stop offset="1" stopColor="#9634F5" />
                  </linearGradient>
                </defs>

                <g
                  stroke="url(#sparklePurple)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16.5 12.5 C17.8 19.2 20.8 22.2 27.5 23.5 C20.8 24.8 17.8 27.8 16.5 34.5 C15.2 27.8 12.2 24.8 5.5 23.5 C12.2 22.2 15.2 19.2 16.5 12.5Z" />

                  <path d="M36 3 C36.8 7.2 38.8 9.2 43 10 C38.8 10.8 36.8 12.8 36 17 C35.2 12.8 33.2 10.8 29 10 C33.2 9.2 35.2 7.2 36 3Z" />
                </g>
              </svg>

              <h2 className="text-base font-bold">
                Descubre
              </h2>

              <p className="text-xs text-gray-200">
                Nuevos mundos y talentos
              </p>

            </div>

            <div className="flex flex-col items-center gap-2 text-center">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="42"
                height="42"
                viewBox="0 0 42 42"
                fill="none"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient
                    id="starPurple"
                    x1="5"
                    y1="3"
                    x2="37"
                    y2="39"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop offset="0" stopColor="#C14BFF" />
                    <stop offset="1" stopColor="#9634F5" />
                  </linearGradient>
                </defs>

                <path
                  d="M20.1 4.1
                     C20.5 3.1 21.9 3.1 22.3 4.1
                     L26.3 12.2
                     C26.6 12.8 27.1 13.2 27.8 13.3
                     L36.7 14.6
                     C37.8 14.8 38.2 16.1 37.4 16.9
                     L31 23.2
                     C30.5 23.7 30.3 24.3 30.4 25
                     L31.9 33.9
                     C32.1 35 31 35.8 30 35.3
                     L22 31.1
                     C21.4 30.8 20.8 30.8 20.2 31.1
                     L12.2 35.3
                     C11.2 35.8 10.1 35 10.3 33.9
                     L11.8 25
                     C11.9 24.3 11.7 23.7 11.2 23.2
                     L4.8 16.9
                     C4 16.1 4.4 14.8 5.5 14.6
                     L14.4 13.3
                     C15.1 13.2 15.6 12.8 15.9 12.2
                     Z"
                  stroke="url(#starPurple)"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <h2 className="text-base font-bold">
                Puntúa
              </h2>

              <p className="text-xs text-gray-200">
                Tu valoración cuenta
              </p>

            </div>

          </div>
        </section>

        <LoginForm />

      </div>
    </main>
  )
}

export default LoginPage