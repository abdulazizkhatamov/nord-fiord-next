"use client";
import React from "react";
import Link from "next/link";
import { AppShell, Burger, Group, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCategory, IconDashboard, IconPackage } from "@tabler/icons-react";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const data = [
  { link: "/admin", label: "Панель управления", icon: IconDashboard },
  { link: "/admin/categories", label: "Категории", icon: IconCategory },
  { link: "/admin/products", label: "Продукты", icon: IconPackage },
];

export function Sidebar({ children }: Props) {
  const pathname = usePathname();

  const links = data.map((item, index) => (
    <NavLink
      key={index}
      component={Link}
      leftSection={<item.icon stroke={1.5} />}
      href={item.link}
      active={
        item.link === "/admin"
          ? pathname === "/admin"
          : pathname === item.link || pathname.startsWith(`${item.link}/`)
      }
      label={item.label}
    />
  ));

  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
      }}
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger
            opened={mobileOpened}
            onClick={toggleMobile}
            hiddenFrom="sm"
            size="sm"
          />
          <Burger
            opened={desktopOpened}
            onClick={toggleDesktop}
            visibleFrom="sm"
            size="sm"
          />
          Снова здравствуйте!
        </Group>
      </AppShell.Header>
      <AppShell.Navbar p="md">{links}</AppShell.Navbar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
