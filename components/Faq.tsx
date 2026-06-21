export function Faq({ items }: { items: { question: string; answer: string }[] }) {
  return (
    <section className="grid gap-3">
      <h2 className="text-2xl font-bold">FAQ</h2>
      {items.map((item) => (
        <details key={item.question} className="rounded-lg border border-pink-100 bg-white p-4">
          <summary className="cursor-pointer font-bold">{item.question}</summary>
          <p className="mt-3 text-sm leading-6 text-ink/70">{item.answer}</p>
        </details>
      ))}
    </section>
  );
}
