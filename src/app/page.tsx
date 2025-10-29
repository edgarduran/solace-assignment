"use client";

import { useEffect, useState } from "react";

type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
};

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvocates = async (search = "") => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/advocates${search ? `?q=${encodeURIComponent(search)}` : ""}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      setAdvocates(json.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load advocates.");
      setAdvocates([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAdvocates();
  }, []);

  // Trigger search as user types (debounced)
  useEffect(() => {
    const delay = setTimeout(() => {
      fetchAdvocates(query);
    }, 400); // 400ms debounce
    return () => clearTimeout(delay);
  }, [query]);

  return (
    <main className="mx-auto max-w-7xl p-6">
      <h1 className="text-3xl font-semibold mb-6">Find an Advocate</h1>

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:gap-4">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, specialty, or city"
          className="w-full sm:w-96 rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="mt-3 sm:mt-0 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
          >
            Clear
          </button>
        )}
      </div>

      {loading && <div className="animate-pulse rounded-xl bg-gray-100 h-40" />}
      {error && <div className="text-red-600 mb-4">{error}</div>}

      {!loading && !error && (
        <>
          {advocates.length === 0 ? (
            <div className="text-gray-600">No advocates found.</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {advocates.map((a, i) => (
                <div
                  key={i}
                  className="rounded-xl border p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
                >
                  <div className="font-semibold text-lg">
                    {a.firstName} {a.lastName}
                  </div>
                  <div className="text-sm text-gray-500 mb-2">
                    {a.degree} — {a.city}
                  </div>

                  <div className="flex flex-wrap gap-1 mb-2">
                    {a.specialties.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                    {a.specialties.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{a.specialties.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="text-sm text-gray-600">
                    <span className="font-medium">{a.yearsOfExperience}</span> years experience
                  </div>
                  <div className="text-sm text-gray-600">
                    📞{" "}
                    {a.phoneNumber
                      .toString()
                      .replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
