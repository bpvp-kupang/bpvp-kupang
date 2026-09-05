
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bot, MessageCircle, Send, X } from "lucide-react";

type Msg = {
  me: boolean;
  text: string;
  link?: {
    href: string;
    label: string;
  };
};

const CHIPS = [
  "Jadwal",
  "Cara daftar",
  "Syarat",
  "Sertifikat",
  "Cek status",
  "Lowongan",
];

export default function Chatbot() {
  const path = usePathname();

  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [typing, setTyping] = useState(false);
  const [v, setV] = useState("");

  // Jangan tampilkan chatbot di halaman admin
  if (path?.startsWith("/admin")) {
    return null;
  }

  async function send(text: string) {
    if (!text.trim() || typing) {
      return;
    }

    setMsgs((messages) => [
      ...messages,
      {
        me: true,
        text: text.trim(),
      },
    ]);

    setV("");
    setTyping(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menghubungi chatbot");
      }

      const data = await response.json();

      setMsgs((messages) => [
        ...messages,
        {
          me: false,
          text:
            data.reply ||
            "Maaf, saya belum menemukan informasi tersebut.",
          link: data.link,
        },
      ]);
    } catch {
      setMsgs((messages) => [
        ...messages,
        {
          me: false,
          text: "Koneksi bermasalah. Silakan coba lagi.",
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function toggleChat() {
    const nextOpen = !open;

    setOpen(nextOpen);

    if (nextOpen && msgs.length === 0) {
      setMsgs([
        {
          me: false,
          text:
            "Halo! Saya Asisten BPVP Kupang — saya hanya menjawab berdasarkan informasi resmi yang tersedia di situs ini. Silakan pilih topik atau ketik pertanyaan.",
        },
      ]);
    }
  }

  return (
    <div className="fixed right-5 bottom-5 z-[90] flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[480px] w-[min(360px,calc(100vw-40px))] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 bg-navy px-4 py-4 text-white">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-orange">
              <Bot size={19} />
            </div>

            <div>
              <b className="block font-display text-[15px]">
                Asisten BPVP Kupang
              </b>

              <span className="flex items-center gap-1.5 text-[11.5px] text-[#9FBBDD]">
                <span className="h-2 w-2 rounded-full bg-[#3ED07E]" />
                Online — jawaban dari data situs
              </span>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Tutup chat"
              className="ml-auto opacity-70 transition hover:opacity-100"
            >
              <X size={18} />
            </button>
          </div>

          {/* Pesan */}
          <div className="flex flex-1 flex-col gap-2.5 overflow-y-auto bg-sky2 p-4">
            {msgs.map((message, index) => (
              <div
                key={index}
                className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13.5px] leading-relaxed ${
                  message.me
                    ? "self-end rounded-br-sm bg-navy text-white"
                    : "self-start rounded-bl-sm border border-line bg-white"
                }`}
              >
                {message.text}

                {message.link && (
                  <Link
                    href={message.link.href}
                    onClick={() => setOpen(false)}
                    className="mt-1.5 block text-[12.5px] font-bold text-blue"
                  >
                    {message.link.label} →
                  </Link>
                )}
              </div>
            ))}

            {typing && (
              <div className="self-start rounded-2xl border border-line bg-white px-3.5 py-3">
                <span className="typing">
                  <i />
                  <i />
                  <i />
                </span>
              </div>
            )}
          </div>

          {/* Topik cepat */}
          <div className="flex flex-wrap gap-1.5 border-t border-line bg-sky2 px-4 py-2.5">
            {CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => send(chip)}
                disabled={typing}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-bold hover:border-blue hover:text-blue disabled:cursor-not-allowed disabled:opacity-50"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            className="flex gap-2 border-t border-line bg-white p-3"
            onSubmit={(event) => {
              event.preventDefault();
              send(v);
            }}
          >
            <input
              value={v}
              onChange={(event) => setV(event.target.value)}
              placeholder="Tulis pertanyaan…"
              aria-label="Pesan"
              className="flex-1 rounded-lg border-[1.5px] border-line px-3.5 py-2.5 text-[13.5px] font-medium outline-none focus:border-blue"
            />

            <button
              type="submit"
              disabled={typing || !v.trim()}
              className="grid h-10 w-10 place-items-center rounded-lg bg-orange text-white disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Kirim"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Tombol chatbot */}
      <button
        type="button"
        onClick={toggleChat}
        className="grid h-14 w-14 place-items-center rounded-full bg-orange text-white shadow-xl transition hover:scale-105"
        aria-label="Buka asisten BPVP Kupang"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}

