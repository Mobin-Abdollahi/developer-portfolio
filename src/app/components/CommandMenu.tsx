"use client";

import * as React from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function CommandMenu() {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (href: string) => {
    setOpen(false);

    if (href.startsWith("#")) {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    window.open(href, "_blank");
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="glass inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-slate-300 transition hover:text-white"
      >
        <Search size={16} />
        Search
        <span className="rounded-md border border-white/10 px-2 py-0.5 text-xs text-slate-400">
          Ctrl + K
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-1000 bg-black/50 backdrop-blur-sm">
          <div className="mx-auto mt-24 w-full max-w-xl px-4">
            <Command className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900 text-white shadow-2xl">
              <Command.Input
                placeholder="Type a command or search..."
                className="w-full border-b border-white/10 bg-transparent px-4 py-4 outline-none"
              />

              <Command.List className="max-h-80 overflow-y-auto p-2">
                <Command.Empty className="px-4 py-3 text-sm text-slate-400">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Navigation">
                  <Command.Item
                    onSelect={() => runCommand("#about")}
                    className="cursor-pointer rounded-xl px-4 py-3 text-sm hover:bg-white/5"
                  >
                    Go to About
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand("#projects")}
                    className="cursor-pointer rounded-xl px-4 py-3 text-sm hover:bg-white/5"
                  >
                    Go to Projects
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand("#contact")}
                    className="cursor-pointer rounded-xl px-4 py-3 text-sm hover:bg-white/5"
                  >
                    Go to Contact
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Links">
                  <Command.Item
                    onSelect={() => runCommand("/resume.pdf")}
                    className="cursor-pointer rounded-xl px-4 py-3 text-sm hover:bg-white/5"
                  >
                    Open Resume
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand("https://github.com/yourname")}
                    className="cursor-pointer rounded-xl px-4 py-3 text-sm hover:bg-white/5"
                  >
                    <span className="flex items-center gap-2">
                      <FaGithub size={16} />
                      Open GitHub
                    </span>
                  </Command.Item>
                  <Command.Item
                    onSelect={() => runCommand("https://linkedin.com/in/yourname")}
                    className="cursor-pointer rounded-xl px-4 py-3 text-sm hover:bg-white/5"
                  >
                    <span className="flex items-center gap-2">
                      <FaLinkedin size={16} />
                      Open LinkedIn
                    </span>
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </div>

          <button
            onClick={() => setOpen(false)}
            className="absolute inset-0 -z-10"
            aria-label="Close command menu"
          />
        </div>
      )}
    </>
  );
}
