import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, cookies } = context;
  const url = new URL(request.url);

  if (url.pathname !== '/') return next();

  // Bypass during build-time prerendering (headers are empty)
  if (!request.headers.get('user-agent')) {
    return next();
  }

  let variant = cookies.get('ab_hero')?.value;
  if (!variant) {
    variant = Math.random() < 0.5 ? 'a' : 'b';
  }

  const response = variant === 'b'
    ? await context.rewrite('/index-b')
    : await next();

  response.headers.append(
    'Set-Cookie',
    `ab_hero=${variant}; Path=/; Max-Age=2592000; SameSite=Lax`
  );

  return response;
});
