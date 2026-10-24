import { Link } from 'react-router-dom'
import heroImage from '../assets/hero-master.jpeg'

export default function Home() {
  return (
    <div className="space-y-16">
      {/* HERO */}
      <section
        className="
          relative left-1/2 w-screen -translate-x-1/2
          bg-cover bg-center bg-no-repeat
          text-white
        "
        style={{
          backgroundImage: `url(${heroImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 flex min-h-[560px] items-center justify-center px-6 py-20">
          <div className="mx-auto flex w-full max-w-5xl flex-col items-center text-center">
            <p className="mb-5 text-center text-sm font-semibold uppercase tracking-[0.28em] text-neutral-200">
              HandmadeMaster BG
            </p>

            <h1 className="max-w-4xl text-center text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Открий ръчно изработени изделия от български майстори
            </h1>

            <p className="mt-6 max-w-2xl text-center text-lg leading-8 text-neutral-200 sm:text-xl">
              Разгледай уникални изделия, създадени на ръка, запознай се с
              майсторите зад тях и открий продукт с характер и история.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
  to="/products"
  className="
    inline-flex min-w-56 justify-center
    border border-white/70
    bg-black/20 px-6 py-3
    font-semibold text-white
    backdrop-blur-sm
    transition-all duration-200
    hover:-translate-y-0.5
    hover:border-white
    hover:bg-white
    hover:text-neutral-900
    hover:shadow-lg
  "
>
  Разгледай продуктите
</Link>

<Link
  to="/masters"
  className="
    inline-flex min-w-56 justify-center
    border border-white/70
    bg-black/20 px-6 py-3
    font-semibold text-white
    backdrop-blur-sm
    transition-all duration-200
    hover:-translate-y-0.5
    hover:border-white
    hover:bg-white
    hover:text-neutral-900
    hover:shadow-lg
  "
>
  Виж майсторите
</Link>
            </div>
          </div>
        </div>
      </section>


      {/* REGISTER CTA */}
      <section className="border border-slate-200 bg-white px-6 py-12 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Създаваш ръчно изработени изделия?
            </h2>

            <p className="mt-3 max-w-2xl text-slate-600">
              Създай профил, представи своята дейност и публикувай продуктите
              си в каталога.
            </p>
          </div>

          <Link
            to="/register"
            className="
              shrink-0
              bg-neutral-900 px-6 py-3
              font-semibold text-white
              transition hover:bg-neutral-700
            "
          >
            Създай профил
          </Link>
        </div>
      </section>
    </div>
  )
}