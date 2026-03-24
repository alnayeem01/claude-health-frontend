export default function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24">
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
        <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-lg font-semibold text-slate-800">
          Simulating parallel universes…
        </p>
        <p className="text-sm text-slate-500">
          The multiverse is calculating your futures
        </p>
      </div>
    </div>
  );
}
