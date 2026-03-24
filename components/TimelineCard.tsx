type Props = {
  year: string;
  text: string;
  variant: "a" | "b";
};

export default function TimelineCard({ year, text, variant }: Props) {
  return (
    <div
      className={`rounded-xl border p-5 transition-all ${
        variant === "a"
          ? "bg-green-50 border-green-300"
          : "bg-red-50 border-red-300"
      }`}
    >
      <p
        className={`text-xs font-bold uppercase tracking-widest mb-2 ${
          variant === "a" ? "text-green-600" : "text-red-600"
        }`}
      >
        {year}
      </p>
      <p className="text-sm leading-relaxed text-slate-700">{text}</p>
    </div>
  );
}
