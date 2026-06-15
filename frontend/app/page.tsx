import { Hero, Products } from '@/components/Homepage';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Products />
    </div>
  );
}
