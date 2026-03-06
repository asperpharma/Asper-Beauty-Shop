import { useEffect, useState } from "react";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

interface Note {
  id: number;
  title: string;
}

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError("Supabase not configured");
      return;
    }
    supabase
      .from("notes")
      .select()
      .then(({ data, error: err }) => {
        if (err) setError(err.message);
        else setNotes((data ?? []) as Note[]);
      });
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 container py-12">
          <h1 className="font-heading text-2xl font-bold text-maroon">
            Notes
          </h1>
          <p className="mt-4 text-dark-charcoal">Error: {error}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 container py-12">
        <h1 className="font-heading text-3xl font-bold text-maroon">Notes</h1>
        <p className="mt-2 font-body text-dark-charcoal">
          Sample data from Supabase.
        </p>
        <pre className="mt-6 p-6 bg-white rounded-sm border border-shiny-gold/30 shadow-sm overflow-auto text-sm">
          {JSON.stringify(notes, null, 2)}
        </pre>
      </main>
      <Footer />
    </div>
  );
}
