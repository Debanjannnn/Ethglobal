import { Navbar } from "@/components/navbar";
import { BokehBackground } from "@/components/ui/bokeh-background";
import { SwapCard } from "@/components/swap-card";

export default function Home() {
  return (
    <main className="min-h-[100svh] relative">
    <Navbar />

    <BokehBackground />

    <section className="mx-auto max-w-6xl px-4 pt-20 pb-16 md:pt-28">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-pretty text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight">
          {"Swap anytime,"}
          <br className="hidden sm:block" />
          {"anywhere."}
        </h1>

        <div className="mt-8">
          <SwapCard />
        </div>

        <p className="mt-6 max-w-xl text-center text-muted-foreground">
          {"Buy and sell crypto on multiple networks with low fees."}
        </p>

        <div className="mt-10 text-sm text-muted-foreground">Scroll to learn more</div>
      </div>
    </section>
  </main>
  );
}
