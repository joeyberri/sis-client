import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function Page() {
  const { userId, sessionClaims } = await auth();

  if (userId) {
    // If user is logged in, check if onboarding is complete
    const onboardingComplete = sessionClaims?.metadata?.onboardingComplete;
    if (onboardingComplete) {
      redirect('/dashboard');
    } else {
      redirect('/onboarding');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FCFCF9] px-4">
      <div className="max-w-3xl text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-[#007b86]">
            Redevise SIS
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-sans max-w-2xl mx-auto">
            The modern, data-driven operating system for forward-thinking educational institutions.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button asChild size="lg" className="bg-[#007b86] hover:bg-[#00666f] text-white px-8 py-6 text-lg rounded-xl shadow-lg transition-all hover:scale-105">
            <Link href="/auth/sign-up">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="border-[#007b86] text-[#007b86] hover:bg-[#007b86]/5 px-8 py-6 text-lg rounded-xl transition-all">
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
        </div>

        <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-serif font-bold text-xl mb-2 text-[#8959a9]">Modular Design</h3>
            <p className="text-sm text-muted-foreground">Customizable frameworks for grading, subjects, and assessments.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-serif font-bold text-xl mb-2 text-[#8959a9]">Multi-Tenant</h3>
            <p className="text-sm text-muted-foreground">Securely manage multiple schools or campuses from a single platform.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="font-serif font-bold text-xl mb-2 text-[#8959a9]">Real-time Analytics</h3>
            <p className="text-sm text-muted-foreground">Instant insights into student performance and school operations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
