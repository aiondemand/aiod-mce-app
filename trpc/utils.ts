export function getUrl() {
  const base = (() => {
    if (typeof window !== 'undefined') return '';
    if (process.env.APP_DEPLOYMENT_URL) return `https://${process.env.APP_DEPLOYMENT_URL}`;
    return 'http://localhost:3000';
  })();
  return `${base}${process.env.NEXT_PUBLIC_BASEPATH}/api/trpc`;
}
