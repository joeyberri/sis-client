'use client';

import { useEffect } from 'react';

export default function PWARegistration() {
  useEffect(() => {
    if (
      (typeof window !== 'undefined' &&
        'serviceWorker' in navigator &&
        window.location.protocol === 'https:') ||
      window.location.hostname === 'localhost'
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);

            // Request notification permission
            if (
              'Notification' in window &&
              Notification.permission === 'default'
            ) {
              Notification.requestPermission();
            }
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return null;
}
