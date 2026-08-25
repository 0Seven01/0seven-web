import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Find your perfect fit with the 0Seven size guide.",
  openGraph: {
    title: "Size Guide — 0Seven",
    description: "Find your perfect fit with the 0Seven size guide.",
    url: "/size-guide",
  },
};

export default function SizeGuidePage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Size Guide</h1>
          <p className="text-[var(--color-text-secondary)]">All measurements are in centimetres. When in doubt, size up.</p>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-6">T-Shirts & Roundnecks</h2>
            <Card variant="default" padding="none" className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--color-surface-raised)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="p-4 font-semibold">Size</th>
                    <th className="p-4 font-semibold">Chest</th>
                    <th className="p-4 font-semibold">Length</th>
                    <th className="p-4 font-semibold">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  <tr className="hover:bg-[var(--color-surface-raised)]">
                    <td className="p-4 font-medium">S</td><td className="p-4">96</td><td className="p-4">68</td><td className="p-4">43</td>
                  </tr>
                  <tr className="hover:bg-[var(--color-surface-raised)]">
                    <td className="p-4 font-medium">M</td><td className="p-4">102</td><td className="p-4">71</td><td className="p-4">46</td>
                  </tr>
                  <tr className="hover:bg-[var(--color-surface-raised)]">
                    <td className="p-4 font-medium">L</td><td className="p-4">108</td><td className="p-4">74</td><td className="p-4">49</td>
                  </tr>
                  <tr className="hover:bg-[var(--color-surface-raised)]">
                    <td className="p-4 font-medium">XL</td><td className="p-4">114</td><td className="p-4">77</td><td className="p-4">52</td>
                  </tr>
                  <tr className="hover:bg-[var(--color-surface-raised)]">
                    <td className="p-4 font-medium">XXL</td><td className="p-4">120</td><td className="p-4">80</td><td className="p-4">55</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-6">Hoodies & Sweatshirts</h2>
            <Card variant="default" padding="none" className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[var(--color-surface-raised)] border-b border-[var(--color-border)]">
                  <tr>
                    <th className="p-4 font-semibold">Size</th>
                    <th className="p-4 font-semibold">Chest</th>
                    <th className="p-4 font-semibold">Length</th>
                    <th className="p-4 font-semibold">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)]">
                  <tr className="hover:bg-[var(--color-surface-raised)]">
                    <td className="p-4 font-medium">S</td><td className="p-4">102</td><td className="p-4">66</td><td className="p-4">48</td>
                  </tr>
                  <tr className="hover:bg-[var(--color-surface-raised)]">
                    <td className="p-4 font-medium">M</td><td className="p-4">108</td><td className="p-4">69</td><td className="p-4">51</td>
                  </tr>
                  <tr className="hover:bg-[var(--color-surface-raised)]">
                    <td className="p-4 font-medium">L</td><td className="p-4">114</td><td className="p-4">72</td><td className="p-4">54</td>
                  </tr>
                  <tr className="hover:bg-[var(--color-surface-raised)]">
                    <td className="p-4 font-medium">XL</td><td className="p-4">120</td><td className="p-4">75</td><td className="p-4">57</td>
                  </tr>
                  <tr className="hover:bg-[var(--color-surface-raised)]">
                    <td className="p-4 font-medium">XXL</td><td className="p-4">126</td><td className="p-4">78</td><td className="p-4">60</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
