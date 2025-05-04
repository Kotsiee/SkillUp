// deno-lint-ignore-file no-explicit-any
import { useState, useEffect, useContext } from 'preact/hooks';
import { createContext } from 'preact';
import { PageProps } from '$fresh/server.ts';
import { Profile } from '../../lib/newtypes/index.ts';

const ProfileContext = createContext<any>(null);

export function ProfileProvider({
  pageProps,
  children,
}: {
  pageProps: PageProps;
  children: preact.ComponentChildren;
}) {
  const [profile, setProfile] = useState<Profile | null>(null);

  async function fetchProfile(u: string): Promise<Profile | null> {
    try {
      const response = await fetch(`/api/user/${u}`);
      if (!response.ok) throw new Error('Failed to fetch profile data');
      const p = await response.json();
      setProfile(p);
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  useEffect(() => {
    if ((!profile || profile.profile.handle !== pageProps.params.user) && pageProps.params.user) {
      fetchProfile(pageProps.params.user);
    }
  }, [pageProps]);

  return (
    <ProfileContext.Provider value={{ profile, fetchProfile }}>{children}</ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfile must be used within a ProfileProvider');
  return context;
}
