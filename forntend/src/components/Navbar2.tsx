import React, { useEffect, useRef, useState } from "react";

const Navbar2: React.FC = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  // Close popovers on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node) &&
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
      } else if (
        searchRef.current &&
        !searchRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      } else if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:py-4">
        {/* LEFT: Logo */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-1">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-500 to-red-500 text-white font-bold text-xl">
              A
            </span>
            <span className="hidden text-xl font-semibold tracking-tight text-rose-500 sm:inline">
              airbnb
            </span>
          </div>
        </div>

        {/* CENTER: Search pill (desktop) */}
        <div
          ref={searchRef}
          className="relative hidden flex-1 justify-center md:flex"
        >
          <button
            type="button"
            onClick={() => setIsSearchOpen((o) => !o)}
            className={[
              "group flex items-center rounded-full border border-gray-200 bg-white",
              "px-4 py-2 shadow-sm transition-all duration-200 ease-out",
              "hover:shadow-md hover:-translate-y-[1px]",
              "active:scale-95",
              isSearchOpen ? "shadow-lg ring-2 ring-gray-200" : "",
            ].join(" ")}
          >
            <div className="flex items-center divide-x divide-gray-200 text-sm font-medium text-gray-700">
              <span className="px-3">Anywhere</span>
              <span className="px-3 hidden sm:inline">Any week</span>
              <span className="flex items-center gap-2 px-3 text-gray-500">
                <span className="hidden sm:inline">Add guests</span>
                <span className="inline sm:hidden">Guests</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white transition-transform duration-200 group-hover:scale-110">
                  {/* Search icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                    />
                  </svg>
                </span>
              </span>
            </div>
          </button>

          {/* Search popover */}
          {isSearchOpen && (
            <>
              {/* Light overlay below navbar */}
              <div className="fixed inset-0 z-10 bg-black/10" />

              <div className="absolute left-1/2 top-[110%] z-20 w-[min(100%,720px)] -translate-x-1/2">
                <div
                  className={[
                    "rounded-3xl border border-gray-200 bg-white shadow-xl",
                    "transition-all duration-200 ease-out",
                    "origin-top scale-100 opacity-100 translate-y-0",
                  ].join(" ")}
                >
                  <div className="grid grid-cols-1 divide-y divide-gray-200 md:grid-cols-4 md:divide-y-0">
                    {/* Where */}
                    <div className="flex flex-col gap-1 px-6 py-4 hover:bg-gray-50">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                        Where
                      </span>
                      <input
                        className="mt-1 w-full rounded-xl border border-transparent bg-gray-100 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:outline-none"
                        placeholder="Search destinations"
                      />
                    </div>

                    {/* Check in */}
                    <div className="flex flex-col gap-1 px-6 py-4 hover:bg-gray-50">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                        Check in
                      </span>
                      <button
                        className="mt-1 w-full rounded-xl border border-transparent bg-gray-100 px-3 py-2 text-left text-sm text-gray-500 transition-all duration-150 hover:bg-white hover:border-gray-300"
                        type="button"
                      >
                        Add dates
                      </button>
                    </div>

                    {/* Check out */}
                    <div className="flex flex-col gap-1 px-6 py-4 hover:bg-gray-50">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                        Check out
                      </span>
                      <button
                        className="mt-1 w-full rounded-xl border border-transparent bg-gray-100 px-3 py-2 text-left text-sm text-gray-500 transition-all duration-150 hover:bg-white hover:border-gray-300"
                        type="button"
                      >
                        Add dates
                      </button>
                    </div>

                    {/* Who */}
                    <div className="flex flex-col justify-between gap-1 px-6 py-4 hover:bg-gray-50">
                      <div>
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-900">
                          Who
                        </span>
                        <button
                          className="mt-1 w-full rounded-xl border border-transparent bg-gray-100 px-3 py-2 text-left text-sm text-gray-500 transition-all duration-150 hover:bg-white hover:border-gray-300"
                          type="button"
                        >
                          Add guests
                        </button>
                      </div>

                      <div className="mt-3 flex justify-end">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-md transition-transform duration-200 hover:-translate-y-[1px] hover:shadow-lg active:scale-95"
                        >
                          <span>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                              />
                            </svg>
                          </span>
                          <span>Search</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-6 py-3 text-xs text-gray-600">
                    <span>
                      Flexible? Try searching by month, place and more.
                    </span>
                    <button
                      type="button"
                      className="rounded-full bg-gray-100 px-4 py-1.5 text-xs font-semibold text-gray-800 transition-all duration-150 hover:bg-gray-200 active:scale-95"
                    >
                      I&apos;m flexible
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* RIGHT: Actions */}
        <div
          ref={profileRef}
          className="flex items-center justify-end gap-2 sm:gap-3"
        >
          <button
            type="button"
            className="hidden rounded-full px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-150 hover:bg-gray-100 active:scale-95 lg:inline"
          >
            Airbnb your home
          </button>

          <button
            type="button"
            className="hidden rounded-full p-2 text-gray-700 transition-all duration-150 hover:bg-gray-100 active:scale-95 md:inline-flex"
          >
            {/* Globe icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3a9 9 0 000 18 9 9 0 000-18z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.6 9h16.8M3.6 15h16.8M12 3a14 14 0 010 18M12 3a14 14 0 000 18"
              />
            </svg>
          </button>

          {/* Profile button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileOpen((o) => !o)}
              className={[
                "flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5",
                "shadow-sm transition-all duration-150 hover:shadow-md hover:-translate-y-[1px]",
                "active:scale-95",
              ].join(" ")}
            >
              {/* Hamburger / menu icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 8h16M4 16h16"
                />
              </svg>
              {/* Avatar */}
              <span className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-gray-500 text-xs font-semibold text-white">
                <span>AK</span>
              </span>
            </button>

            {/* Profile dropdown */}
            {isProfileOpen && (
              <div
                className={[
                  "absolute right-0 mt-3 w-60 origin-top-right rounded-2xl border border-gray-200 bg-white shadow-xl",
                  "transition-all duration-150 ease-out",
                  "scale-100 opacity-100 translate-y-0",
                ].join(" ")}
              >
                <div className="py-1 text-sm text-gray-800">
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left font-semibold hover:bg-gray-100 active:scale-[0.99]"
                  >
                    Sign up
                  </button>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 active:scale-[0.99]"
                  >
                    Log in
                  </button>
                  <div className="my-1 border-t border-gray-200" />
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 active:scale-[0.99]"
                  >
                    Airbnb your home
                  </button>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left hover:bg-gray-100 active:scale-[0.99]"
                  >
                    Help Center
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE search bar below nav */}
      <div className="border-t border-gray-200 bg-white px-4 pb-3 pt-2 md:hidden">
        <button
          type="button"
          onClick={() => setIsSearchOpen((o) => !o)}
          className={[
            "flex w-full items-center justify-between rounded-full border border-gray-200 bg-white px-4 py-2",
            "shadow-sm transition-all duration-200 ease-out",
            "hover:shadow-md hover:-translate-y-[1px]",
            "active:scale-95",
            isSearchOpen ? "shadow-lg ring-2 ring-gray-200" : "",
          ].join(" ")}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
                />
              </svg>
            </span>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-gray-900">
                Anywhere
              </span>
              <span className="text-xs text-gray-500">
                Any week • Add guests
              </span>
            </div>
          </div>
          <span className="text-xs font-semibold text-gray-800">Search</span>
        </button>

        {/* on mobile we reuse the same popover above (fixed & absolute) controlled by isSearchOpen */}
      </div>
    </header>
  );
};

export default Navbar2;
