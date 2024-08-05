import React, { useContext, useEffect, useMemo } from 'react';
import { withEmotionCache } from '@emotion/react';
import { ChakraProvider, cookieStorageManagerSSR } from '@chakra-ui/react';
import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import { LinksFunction, json, TypedResponse, LoaderFunctionArgs } from '@remix-run/node';
import theme from './theme/theme';
import { ServerStyleContext, ClientStyleContext } from './context';
import { authenticateCookie } from './authenticateCookie.server';
import { getBasicBlogInfo } from './getBasicBlogInfo.server';
import { RootLoaderData } from './types/root';

export const loader = async ({ request }: LoaderFunctionArgs): Promise<TypedResponse<RootLoaderData>> => {
  const authCookie = await authenticateCookie(request);
  const blogInfo = await getBasicBlogInfo();
  const cookies = request.headers.get('cookie') ?? '';

  return json({ ...authCookie, ...blogInfo, cookies });
};

export const links: LinksFunction = () => {
  return [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap',
    },
  ];
};

interface DocumentProps {
  children: React.ReactNode;
}

const Document = withEmotionCache(({ children }: DocumentProps, emotionCache) => {
  const serverStyleData = useContext(ServerStyleContext);
  const clientStyleData = useContext(ClientStyleContext);

  // here we can set the default color mode. If we set it to null,
  // there's no way for us to know what is the the user's preferred theme
  // so the client will have to figure out and maybe there'll be a flash the first time the user visits us.
  const DEFAULT_COLOR_MODE: 'dark' | 'light' | null = 'dark';
  const CHAKRA_COOKIE_COLOR_KEY = 'chakra-ui-color-mode';

  function getColorMode(cookies: string) {
    const match = cookies.match(new RegExp(`(^| )${CHAKRA_COOKIE_COLOR_KEY}=([^;]+)`));
    return match == null ? void 0 : match[2];
  }

  let { cookies } = useLoaderData<typeof loader>();

  // the client get the cookies from the document
  // because when we do a client routing, the loader can have stored an outdated value
  if (typeof document !== 'undefined') {
    cookies = document.cookie;
  }

  // get and store the color mode from the cookies.
  // It'll update the cookies if there isn't any and we have set a default value
  const colorMode = useMemo(() => {
    let color = getColorMode(cookies);

    if (!color && DEFAULT_COLOR_MODE) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      cookies += ` ${CHAKRA_COOKIE_COLOR_KEY}=${DEFAULT_COLOR_MODE}`;
      color = DEFAULT_COLOR_MODE;
    }

    return color;
  }, [cookies]);

  // Only executed on client
  useEffect(() => {
    // re-link sheet container
    emotionCache.sheet.container = document.head;
    // re-inject tags
    const tags = emotionCache.sheet.tags;
    emotionCache.sheet.flush();
    tags.forEach((tag) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (emotionCache.sheet as any)._insertTag(tag);
    });
    // reset cache to reapply global styles
    clientStyleData?.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <html
      lang="en"
      {...(colorMode && {
        'data-theme': colorMode,
        style: { colorScheme: colorMode },
      })}
    >
      <head>
        <meta httpEquiv="Content-Type" content="text/html;charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        {serverStyleData?.map(({ key, ids, css }) => (
          <style key={key} data-emotion={`${key} ${ids.join(' ')}`} dangerouslySetInnerHTML={{ __html: css }} />
        ))}
      </head>
      <body
        {...(colorMode && {
          className: `chakra-ui-${colorMode}`,
        })}
      >
        <ChakraProvider colorModeManager={cookieStorageManagerSSR(cookies)} theme={theme}>
          {children}
        </ChakraProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
});

export default function App() {
  return (
    <Document>
      <Outlet />
    </Document>
  );
}
