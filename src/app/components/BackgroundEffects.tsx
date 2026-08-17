export default function BackgroundEffects() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute left-[-10%] top-[-10%] h-128 w-lg rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute right-[-10%] top-[10%] h-112 w-md rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute bottom-[-10%] left-[20%] h-96 w-[24rem] rounded-full bg-blue-500/10 blur-3xl" />

      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-[#08111f]" />
    </div>
  );
}
