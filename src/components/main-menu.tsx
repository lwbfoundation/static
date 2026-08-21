import {
  Box,
  Link,
  Menu,
  MenuButton,
  MenuList,
  Stack,
  StackProps,
  useDisclosure,
} from '@chakra-ui/react';
import { graphql, useStaticQuery } from 'gatsby';
import React, { FunctionComponent, ReactElement } from 'react';
import { MenuItemLike, resolveMenuLink } from '../utils/menu-link';

interface WpMenuItem extends MenuItemLike {
  readonly id: string;
  readonly label: string;
  readonly target?: string | null;
  readonly parentId?: string | null;
}

export interface MainMenuItem {
  readonly id: string;
  readonly label: string;
  readonly href: string;
  readonly isExternal: boolean;
  readonly target?: string | null;
  readonly children: MainMenuItem[];
}

/**
 * Used only when the WordPress "Main Menu" isn't available to WPGraphQL, so the
 * site never ends up without navigation. See docs/wordpress-main-menu.md.
 */
const FALLBACK_ITEMS: MainMenuItem[] = [
  { label: 'Donate', href: '/#donate' },
  { label: 'For Students', href: '/scholarship/' },
  { label: 'Newsletter', href: '/#sign-up' },
  { label: 'About', href: '/#about' },
  { label: 'Results', href: '/#results' },
  { label: 'Lewis W. Butler', href: '/#lewis-w-butler' },
  { label: 'Board', href: '/#board' },
  { label: 'Mentors', href: '/mentors/' },
].map((item) => ({
  ...item,
  id: `fallback-${item.href}`,
  isExternal: false,
  children: [],
}));

const HOME_ITEM: MainMenuItem = {
  id: 'home',
  label: 'Home',
  href: '/',
  isExternal: false,
  children: [],
};

function toMainMenuItem(item: WpMenuItem, all: WpMenuItem[]): MainMenuItem {
  const { href, isExternal } = resolveMenuLink(item);

  return {
    id: item.id,
    label: item.label,
    href,
    isExternal,
    target: item.target,
    children: all
      .filter((child) => child.parentId === item.id)
      .map((child) => toMainMenuItem(child, all)),
  };
}

export function useMainMenu(): MainMenuItem[] {
  const { wpMenu } = useStaticQuery(graphql`
    query MainMenu {
      wpMenu(slug: { eq: "main-menu" }) {
        menuItems {
          nodes {
            id
            label
            url
            target
            parentId
            connectedNode {
              node {
                ... on WpContentNode {
                  uri
                }
              }
            }
          }
        }
      }
    }
  `);

  const nodes: WpMenuItem[] = wpMenu?.menuItems?.nodes ?? [];

  if (!nodes.length) {
    return FALLBACK_ITEMS;
  }

  return nodes
    .filter((item) => !item.parentId)
    .map((item) => toMainMenuItem(item, nodes));
}

const linkProps = (item: MainMenuItem) => ({
  href: item.href,
  ...(item.isExternal || item.target === '_blank'
    ? { target: '_blank', rel: 'noreferrer' }
    : {}),
});

/**
 * Chakra's Menu has no nested-submenu primitive, so anything deeper than one
 * level is flattened into the same dropdown and indented instead of dropped.
 */
function flattenForDropdown(
  items: MainMenuItem[],
  depth = 0
): { item: MainMenuItem; depth: number }[] {
  const entries: { item: MainMenuItem; depth: number }[] = [];

  items.forEach((item) => {
    entries.push({ item, depth });
    entries.push(...flattenForDropdown(item.children, depth + 1));
  });

  return entries;
}

function DesktopItem({ item }: { item: MainMenuItem }): ReactElement {
  const { isOpen, onOpen, onClose } = useDisclosure();

  if (!item.children.length) {
    return <Link {...linkProps(item)}>{item.label}</Link>;
  }

  // A parent with children opens the dropdown rather than navigating, so its
  // own destination leads the dropdown — unless it has none, or a child already
  // points there, which is how WP menus usually model a clickable parent.
  const entries = flattenForDropdown(item.children);
  const alreadyLinked = entries.some((entry) => entry.item.href === item.href);
  if (item.href && item.href !== '#' && !alreadyLinked) {
    entries.unshift({ item, depth: 0 });
  }

  return (
    // The MenuList is a DOM descendant of this Box, so moving the pointer from
    // the button into the dropdown never fires mouseleave. gutter={0} keeps the
    // two flush; any gap would close the menu as the pointer crossed it.
    <Box onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Menu
        isOpen={isOpen}
        onOpen={onOpen}
        onClose={onClose}
        autoSelect={false}
        placement="bottom-start"
        gutter={0}
      >
        {/* No hover underline: this opens a panel rather than navigating. */}
        <MenuButton
          type="button"
          cursor="pointer"
          lineHeight="inherit"
          textTransform="uppercase"
          fontWeight={600}
        >
          {item.label}
        </MenuButton>
        <MenuList
          backgroundColor="blue.brand"
          color="white"
          border="none"
          borderRadius={0}
          boxShadow="md"
          minWidth="14rem"
          paddingY={2}
          zIndex={20}
        >
          {entries.map(({ item: entry, depth }) => (
            <Link
              key={entry.id}
              {...linkProps(entry)}
              display="block"
              paddingY={2}
              paddingRight={4}
              paddingLeft={4 + depth * 4}
              textTransform="uppercase"
              fontWeight={depth ? 400 : 600}
              fontSize="sm"
              _hover={{
                backgroundColor: 'orange.brand',
                textDecoration: 'none',
              }}
              _focus={{
                backgroundColor: 'orange.brand',
                textDecoration: 'none',
              }}
            >
              {entry.label}
            </Link>
          ))}
        </MenuList>
      </Menu>
    </Box>
  );
}

function MobileItem({
  item,
  depth = 0,
}: {
  item: MainMenuItem;
  depth?: number;
}): ReactElement {
  return (
    <Box fontWeight={depth ? 400 : 600} fontSize={depth ? 'sm' : 'md'}>
      {/* A parent with no destination of its own (url "#" in WP) is a heading. */}
      {!item.href || item.href === '#' ? (
        item.label
      ) : (
        <Link {...linkProps(item)}>{item.label}</Link>
      )}
      {!!item.children.length && (
        <Stack direction="column" spacing={2} marginTop={2} paddingLeft={4}>
          {item.children.map((child) => (
            <MobileItem key={child.id} item={child} depth={depth + 1} />
          ))}
        </Stack>
      )}
    </Box>
  );
}

export interface MainMenuProps extends Omit<StackProps, 'children'> {
  readonly variant: 'desktop' | 'mobile';
  readonly showHomeLink?: boolean;
}

const MainMenu: FunctionComponent<MainMenuProps> = ({
  variant,
  showHomeLink = false,
  ...stackProps
}) => {
  const menuItems = useMainMenu();
  const items = showHomeLink ? [HOME_ITEM, ...menuItems] : menuItems;
  const isMobile = variant === 'mobile';

  return (
    <Stack
      direction={isMobile ? 'column' : 'row'}
      marginY={isMobile ? 4 : 0}
      marginLeft={isMobile ? 0 : 16}
      paddingX={isMobile ? 6 : 0}
      spacing={isMobile ? 4 : 8}
      textAlign="left"
      textTransform="uppercase"
      textUnderlineOffset="0.25rem"
      fontWeight={600}
      width={isMobile ? '100%' : 'auto'}
      {...stackProps}
    >
      {items.map((item) =>
        isMobile ? (
          <MobileItem key={item.id} item={item} />
        ) : (
          <Box key={item.id}>
            <DesktopItem item={item} />
          </Box>
        )
      )}
    </Stack>
  );
};

export default MainMenu;
