const envUrl = import.meta.env.VITE_DEVELOPER_DOCS_URL;

export const developerDocsHref =
  typeof envUrl === 'string' && envUrl.trim().length > 0
    ? envUrl
    : '/docs/';
