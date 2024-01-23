// entry.client.tsx
import React, { useState } from 'react';
import { CacheProvider } from '@emotion/react';
import { RemixBrowser } from '@remix-run/react';
import { ClientStyleContext } from './context';
import createEmotionCache, { defaultCache } from './createEmotionCache';
import { startTransition, StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

interface ClientCacheProviderProps {
  children: React.ReactNode;
}

function ClientCacheProvider({ children }: ClientCacheProviderProps) {
  const [cache, setCache] = useState(defaultCache);

  function reset() {
    setCache(createEmotionCache());
  }

  return (
    <ClientStyleContext.Provider value={{ reset }}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ClientStyleContext.Provider>
  );
}

startTransition(() => {
  hydrateRoot(
    document,
    <StrictMode>
      <ClientCacheProvider>
        <RemixBrowser />
      </ClientCacheProvider>
    </StrictMode>,
  );
});
