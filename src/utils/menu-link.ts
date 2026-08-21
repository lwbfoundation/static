/**
 * WordPress menu items come back with absolute URLs pointing at the CMS host
 * (e.g. https://admin.lewiswbutlerfoundation.org/scholarship/), custom links
 * that may be pure anchors (#donate), or mailto:/tel: links. This normalizes
 * them into something the static site can link to.
 */

// Any host under this domain (the CMS, the live site, www) is treated as internal.
const INTERNAL_HOST_SUFFIX = 'lewiswbutlerfoundation.org';

export interface MenuLink {
  readonly href: string;
  readonly isExternal: boolean;
}

export interface MenuItemLike {
  readonly url?: string | null;
  readonly connectedNode?: {
    readonly node?: {
      readonly uri?: string | null;
    } | null;
  } | null;
}

function isInternalHost(hostname: string): boolean {
  return (
    hostname === INTERNAL_HOST_SUFFIX ||
    hostname.endsWith(`.${INTERNAL_HOST_SUFFIX}`)
  );
}

/** Adds leading/trailing slashes to the path while leaving any #hash intact. */
function normalizeInternal(pathname: string, hash = ''): string {
  let path = pathname || '/';

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  if (!path.endsWith('/')) {
    path = `${path}/`;
  }

  return `${path}${hash}`;
}

export function resolveMenuLink(item: MenuItemLike): MenuLink {
  // A menu item connected to a real page/post knows its own uri, which is
  // already relative and always more trustworthy than the stored url.
  const uri = item.connectedNode?.node?.uri;
  if (uri) {
    return { href: normalizeInternal(uri), isExternal: false };
  }

  const raw = (item.url || '').trim();

  if (!raw || raw === '#') {
    return { href: '#', isExternal: false };
  }

  // Pure anchor links (#donate) are relative to the homepage.
  if (raw.startsWith('#')) {
    return { href: `/${raw}`, isExternal: false };
  }

  if (/^(mailto:|tel:)/i.test(raw)) {
    return { href: raw, isExternal: true };
  }

  if (/^https?:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      if (isInternalHost(parsed.hostname)) {
        return {
          href: normalizeInternal(parsed.pathname, parsed.hash),
          isExternal: false,
        };
      }
    } catch (e) {
      // Fall through and treat an unparseable url as external.
    }

    return { href: raw, isExternal: true };
  }

  // Relative link such as `/scholarship` or `/#donate`.
  const [pathname, hash] = raw.split('#');
  return {
    href: normalizeInternal(pathname, hash ? `#${hash}` : ''),
    isExternal: false,
  };
}
