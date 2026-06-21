export function ProsCons({ pros = [], cons = [] }: { pros?: string[]; cons?: string[] }) {
  if (!pros.length && !cons.length) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-mint bg-green-50 p-5">
        <h3 className="font-bold">Pros</h3>
        <ul className="mt-3 grid gap-2 text-sm text-ink/70">
          {pros.map((item) => <li key={item}>+ {item}</li>)}
        </ul>
      </div>
      <div className="rounded-lg border border-pink-100 bg-pink-50 p-5">
        <h3 className="font-bold">Cons</h3>
        <ul className="mt-3 grid gap-2 text-sm text-ink/70">
          {cons.map((item) => <li key={item}>- {item}</li>)}
        </ul>
      </div>
    </div>
  );
}
