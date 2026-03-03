import { auth } from "@/lib/auth"
import { AnimatedBackground } from "@/components/layout/AnimatedBackground"
import { CurtainReveal } from "@/components/landing/CurtainReveal"

export default async function LandingPage() {
  const session = await auth()

  return (
    <AnimatedBackground>
      <CurtainReveal isLoggedIn={!!session?.user} />
    </AnimatedBackground>
  )
}
