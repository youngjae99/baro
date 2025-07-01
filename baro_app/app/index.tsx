import { useEffect } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    // Immediately redirect to camera screen on app launch
    router.replace('/camera');
  }, [router]);

  return null;
}