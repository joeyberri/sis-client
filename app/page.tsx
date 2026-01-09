'use client';

import { Icon } from '@iconify/react';
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
      <div className='max-w-4xl space-y-12 text-center'>
        <div className='space-y-6'>
          <h1 className='font-serif text-6xl font-black tracking-tight text-[#007b86] md:text-8xl'>
            Redevise
          </h1>
          <p className='text-muted-foreground mx-auto max-w-2xl font-sans text-xl leading-relaxed md:text-2xl'>
            The friendliest home for your school's data. Manage everything from
            students to finance in a platform that's built for humans.
          </p>
        </div>

        <div className='flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row'>
          <Button
            asChild
            size='lg'
            className='h-14 rounded-2xl bg-[#007b86] px-10 py-6 text-lg text-white shadow-xl shadow-[#007b86]/20 transition-all hover:scale-105 hover:bg-[#00666f]'
          >
            <Link href='/auth/sign-up'>Get started for free</Link>
          </Button>
          <Button
            asChild
            variant='outline'
            size='lg'
            className='h-14 rounded-2xl border-2 border-[#007b86] px-10 py-6 text-lg text-[#007b86] transition-all hover:bg-[#007b86]/5'
          >
            <Link href='/auth/sign-in'>Sign in to your account</Link>
          </Button>
        </div>

        <div className='grid grid-cols-1 gap-8 pt-12 text-left md:grid-cols-3'>
          <div className='group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md'>
            <div className='mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#8959a9]/10 text-[#8959a9]'>
              <Icon icon='solar:widget-3-duotone' className='size-7' />
            </div>
            <h3 className='text-foreground mb-2 font-sans text-xl font-bold'>
              Built for you
            </h3>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              Flexible tools that adapt to how your school actually works, not
              the other way around.
            </p>
          </div>
          <div className='group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md'>
            <div className='mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#007b86]/10 text-[#007b86]'>
              <Icon icon='solar:city-duotone' className='size-7' />
            </div>
            <h3 className='text-foreground mb-2 font-sans text-xl font-bold'>
              All your schools
            </h3>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              Manage one school or a whole network from a single, beautiful
              dashboard.
            </p>
          </div>
          <div className='group rounded-3xl border border-gray-100 bg-white p-8 shadow-sm transition-all hover:shadow-md'>
            <div className='mb-6 flex size-12 items-center justify-center rounded-2xl bg-[#d27b53]/10 text-[#d27b53]'>
              <Icon icon='solar:chart-square-duotone' className='size-7' />
            </div>
            <h3 className='text-foreground mb-2 font-sans text-xl font-bold'>
              Crystal clear
            </h3>
            <p className='text-muted-foreground text-sm leading-relaxed'>
              Get instant insights without needing a degree in data science.
              It's all right there.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
