'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page() {
  const { userId, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && userId) {
      router.push('/dashboard');
    }
  }, [userId, isLoaded, router]);

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-[#FCFCF9] px-4'>
      <div className='max-w-3xl space-y-8 text-center'>
        <div className='space-y-4'>
          <h1 className='font-serif text-5xl font-bold text-[#007b86] md:text-7xl'>
            Redevise SIS
          </h1>
          <p className='text-muted-foreground mx-auto max-w-2xl font-sans text-xl md:text-2xl'>
            The modern, data-driven operating system for forward-thinking
            educational institutions.
          </p>
        </div>

        <div className='flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row'>
          <Button
            asChild
            size='lg'
            className='rounded-xl bg-[#007b86] px-8 py-6 text-lg text-white shadow-lg transition-all hover:scale-105 hover:bg-[#00666f]'
          >
            <Link href='/auth/sign-up'>Get Started</Link>
          </Button>
          <Button
            asChild
            variant='outline'
            size='lg'
            className='rounded-xl border-[#007b86] px-8 py-6 text-lg text-[#007b86] transition-all hover:bg-[#007b86]/5'
          >
            <Link href='/auth/sign-in'>Sign In</Link>
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-8 pt-12 text-left md:grid-cols-3'>
          <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
            <h3 className='mb-2 font-serif text-xl font-bold text-[#8959a9]'>
              Modular Design
            </h3>
            <p className='text-muted-foreground text-sm'>
              Customizable frameworks for grading, subjects, and assessments.
            </p>
          </div>
          <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
            <h3 className='mb-2 font-serif text-xl font-bold text-[#8959a9]'>
              Multi-Tenant
            </h3>
            <p className='text-muted-foreground text-sm'>
              Securely manage multiple schools or campuses from a single
              platform.
            </p>
          </div>
          <div className='rounded-2xl border border-gray-100 bg-white p-6 shadow-sm'>
            <h3 className='mb-2 font-serif text-xl font-bold text-[#8959a9]'>
              Real-time Analytics
            </h3>
            <p className='text-muted-foreground text-sm'>
              Instant insights into student performance and school operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
