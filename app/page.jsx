"use client";

import { useState } from "react";
import SigilGenerator from "../components/SigilGenerator";

export default function Home() {
  const [page, setPage] = useState("generator");

  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans relative overflow-x-hidden">

      {/* HEADER */}
      <header className="fixed top-0 w-full z-20 bg-black/40 backdrop-blur-md py-4 border-b border-red-900/30">
        <div className="flex justify-center gap-6">
          <button
            onClick={() => setPage("generator")}
            className="px-6 py-2 rounded-xl border border-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-[0_0_15px_#ff0000] transition-all duration-300"
          >
            Генератор
          </button>

          <a
            href="https://your-xenforo-forum-link.com"
            target="_blank"
            className="px-6 py-2 rounded-xl border border-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-[0_0_15px_#ff0000] transition-all duration-300 flex items-center justify-center"
          >
            Форум
          </a>

          <button
            onClick={() => setPage("wiki")}
            className="px-6 py-2 rounded-xl border border-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-[0_0_15px_#ff0000] transition-all duration-300"
          >
            WIKI
          </button>

          <button
            onClick={() => setPage("about")}
            className="px-6 py-2 rounded-xl border border-red-600 hover:bg-red-700 hover:scale-105 hover:shadow-[0_0_15px_#ff0000] transition-all duration-300"
          >
            О проекте
          </button>
        </div>
      </header>

      {/* SIDE PARALLAX */}
      <div className="absolute top-0 left-0 h-full w-40 hidden md:block pointer-events-none select-none">
        <img src="/images/side-left.webp" className="h-full w-full object-cover opacity-60" />
      </div>

      <div className="absolute top-0 right-0 h-full w-40 hidden md:block pointer-events-none select-none">
        <img src="/images/side-right.webp" className="h-full w-full object-cover opacity-60" />
      </div>

      {/* HERO (only for generator) */}
      {page === "generator" && (
        <div
          className="h-[50vh] flex items-center justify-center text-center bg-fixed bg-cover bg-center pt-20"
          style={{ backgroundImage: "url('/images/hero-bgп.jpg')" }}
        >
          <div className="drop-shadow-[0_0_25px_#ff0000aa]">
            <h1 className="text-5xl md:text-7xl font-bold text-red-400 tracking-widest">
              Sigil Maker
            </h1>
            <p className="text-xl mt-4 text-red-200">Создай свой уникальный магический знак</p>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <main className="max-w-[1100px] mx-auto px-6 py-24 relative z-10">

        {page === "generator" && (
          <div>
            <h2 className="text-3xl mb-6 text-red-400 font-semibold">Генератор сигилов</h2>

            {/* MAIN GENERATOR BLOCK */}
            <div className="bg-[#111] p-6 rounded-2xl border border-red-900/40 shadow-[0_0_20px_#ff000020]">
              <SigilGenerator />
            </div>
          </div>
        )}

        {page === "wiki" && (
          <div>
            <h2 className="text-3xl mb-6 text-red-400 font-semibold">WIKI</h2>
            <div className="bg-[#111] p-6 rounded-2xl border border-red-900/40">
              Здесь можно разместить инструкции, техники, мистическую информацию,
              примеры использования и просто полезные советы.
            </div>
          </div>
        )}

        {page === "about" && (
          <div>
            <h2 className="text-3xl mb-6 text-red-400 font-semibold">О проекте</h2>
            <div className="bg-[#111] p-6 rounded-2xl border border-red-900/40 leading-relaxed">
              SigilMaker — проект для создания магических символов, эстетичных знаков,
              и развития комьюнити людей, которым интересна символика и мистицизм.
            </div>
          </div>
        )}

      </main>

      <footer className="py-10 text-center text-gray-500 border-t border-red-900/20">
        © 2025 SigilMaker. Все права защищены.
      </footer>
    </div>
  );
}
