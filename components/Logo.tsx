export default function Logo({ size = 'md', light = false }: { size?: 'sm' | 'md' | 'lg'; light?: boolean }) {
  const box = size === 'lg' ? 'h-14 w-14 text-2xl' : size === 'sm' ? 'h-9 w-9 text-base' : 'h-11 w-11 text-lg';
  const title = size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-xl';

  return (
    <span className="inline-flex items-center gap-3">
      <span
        className={`${box} inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#e8c987] to-[#c9a253] font-black text-[#3b0c13] shadow-lg shadow-[#c9a253]/25`}
      >
        N
      </span>
      <span className="leading-tight">
        <span className={`block ${title} font-bold tracking-tight ${light ? 'text-white' : 'text-wine'}`}>
          Nidhivan
        </span>
        <span
          className={`block text-[10px] font-semibold uppercase tracking-[0.28em] ${
            light ? 'text-gold' : 'text-[#a07d46]'
          }`}
        >
          Restaurant
        </span>
      </span>
    </span>
  );
}
