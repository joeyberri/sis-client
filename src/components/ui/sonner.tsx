'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner, ToasterProps } from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      position='bottom-right'
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:p-4 group-[.toaster]:backdrop-blur-sm',
          title:
            'group-[.toast]:font-bold group-[.toast]:text-base tracking-tight',
          description:
            'group-[.toast]:text-muted-foreground group-[.toast]:text-sm group-[.toast]:leading-relaxed',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:text-sm group-[.toast]:font-bold group-[.toast]:shadow-lg group-[.toast]:shadow-primary/20',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl group-[.toast]:px-4 group-[.toast]:py-2 group-[.toast]:text-sm group-[.toast]:font-medium',
          closeButton:
            'group-[.toast]:bg-background group-[.toast]:text-foreground group-[.toast]:border-border group-[.toast]:hover:bg-muted group-[.toast]:rounded-lg',
          success:
            'group-[.toaster]:bg-green-50/80 group-[.toaster]:text-green-900 group-[.toaster]:border-green-200/50 dark:group-[.toaster]:bg-green-950/30 dark:group-[.toaster]:text-green-100 dark:group-[.toaster]:border-green-800/30',
          error:
            'group-[.toaster]:bg-red-50/80 group-[.toaster]:text-red-900 group-[.toaster]:border-red-200/50 dark:group-[.toaster]:bg-red-950/30 dark:group-[.toaster]:text-red-100 dark:group-[.toaster]:border-red-800/30',
          warning:
            'group-[.toaster]:bg-amber-50/80 group-[.toaster]:text-amber-900 group-[.toaster]:border-amber-200/50 dark:group-[.toaster]:bg-amber-950/30 dark:group-[.toaster]:text-amber-100 dark:group-[.toaster]:border-amber-800/30',
          info: 'group-[.toaster]:bg-blue-50/80 group-[.toaster]:text-blue-900 group-[.toaster]:border-blue-200/50 dark:group-[.toaster]:bg-blue-950/30 dark:group-[.toaster]:text-blue-100 dark:group-[.toaster]:border-blue-800/30'
        }
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)'
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
