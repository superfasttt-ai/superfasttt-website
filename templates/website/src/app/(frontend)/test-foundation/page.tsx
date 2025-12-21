import { FoundationVisual } from '@/blocks/HeroModern/FoundationVisual'

export default function TestFoundationPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-full max-w-4xl p-8">
        <h1 className="text-white text-2xl mb-8 text-center">Test Foundation Visual</h1>
        <FoundationVisual className="w-full" />
      </div>
    </div>
  )
}
