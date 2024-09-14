import Link from "next/link"
import { Button } from "../ui/button"
import HeroCarousel from "./HeroCarousel"

function Hero() {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
      <div>
        <h1 className="max-w-2xl font-bold text-4xl tracking-tight sm:text-6xl">
          All vintage. All authenticate. All affordable.
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-8 text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime quasi repudiandae nemo ducimus, hic reprehenderit pariatur consectetur assumenda fugiat, veniam in aspernatur accusamus officia at esse, quam voluptate molestias minima?
        </p>
        <Button asChild size='lg' className="mt-10">
          <Link href='/products'>Explore stock</Link>
        </Button>
      </div>
      <HeroCarousel />
    </section>
  )
}

export default Hero