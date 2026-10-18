import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="space-y-16">
      <section className="overflow-hidden rounded-3xl bg-slate-900 px-6 py-16 text-white shadow-lg sm:px-10 lg:px-16">
        <div className="max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
            HandmadeMaster BG
          </p>

          <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
            Открий ръчно изработени изделия от български майстори
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Разгледай уникални продукти, създадени на ръка, запознай се с
            майсторите зад тях и открий изделие, което не е просто продукт,
            а истинска изработка.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/products"
              className="inline-flex justify-center rounded-lg bg-amber-500 px-6 py-3 font-semibold text-slate-900 transition hover:bg-amber-400"
            >
              Разгледай продуктите
            </Link>

            <Link
              to="/masters"
              className="inline-flex justify-center rounded-lg border border-slate-600 px-6 py-3 font-semibold text-white transition hover:border-amber-400 hover:text-amber-400"
            >
              Виж майсторите
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">
            Какво ще откриеш тук?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            HandmadeMaster BG събира на едно място различни видове ръчна
            изработка от български творци и занаятчии.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-3xl">🛠️</div>

            <h3 className="text-xl font-semibold text-slate-900">
              Истински майстори
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Разгледай профили на хора, които създават изделия със собствен
              стил, умения и внимание към детайла.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-3xl">🎨</div>

            <h3 className="text-xl font-semibold text-slate-900">
              Разнообразни изделия
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Ножарство, дървообработка, кожа, бижута, керамика, текстил,
              декорация и още много категории.
            </p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 text-3xl">❤️</div>

            <h3 className="text-xl font-semibold text-slate-900">
              Запази любимите си
            </h3>

            <p className="mt-3 leading-7 text-slate-600">
              Влез в профила си и добавяй продукти в любими, за да ги намираш
              лесно по-късно.
            </p>
          </article>
        </div>
      </section>

      <section className="rounded-3xl bg-amber-50 px-6 py-12 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">
              Създаваш ръчно изработени изделия?
            </h2>

            <p className="mt-3 max-w-2xl text-slate-700">
              Създай профил, представи себе си и публикувай своите продукти
              безплатно в каталога.
            </p>
          </div>

          <Link
            to="/register"
            className="shrink-0 rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white transition hover:bg-amber-500 hover:text-slate-900"
          >
            Създай профил
          </Link>
        </div>
      </section>
    </div>
  )
}