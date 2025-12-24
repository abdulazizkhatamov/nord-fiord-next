import React from "react";
import { Sidebar } from "@/components/sidebar/sidebar";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return <Sidebar>{children}</Sidebar>;
}
