import { Navbar } from "@/components/navbar";
import { BokehBackground } from "@/components/ui/bokeh-background";
import { BridgeCard } from "@/components/bridge-card";

export default function BridgePage() {
  return (
    <main className="min-h-[100svh] relative">
      <Navbar />

      <BokehBackground />

      <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 md:pt-28">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-pretty text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight">
            {"Bridge tokens"}
            <br className="hidden sm:block" />
            {"across chains."}
          </h1>

          <div className="mt-8">
            <BridgeCard />
          </div>

          <p className="mt-6 max-w-xl text-center text-muted-foreground">
            {"Move your assets seamlessly between different blockchain networks with minimal fees."}
          </p>

          <div className="mt-10 text-sm text-muted-foreground">Powered by cross-chain technology</div>
        </div>
      </section>
    </main>
  );
}
