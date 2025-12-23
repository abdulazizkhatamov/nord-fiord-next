import { signOutAction } from "@/app/actions/auth";
import { auth } from "@/lib/auth";
import { Button, Text } from "@mantine/core";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });

  console.log(session);

  if (!session) return redirect("/admin/signin");

  return (
    <div>
      <Text>HI, Welcome back !</Text>
      <form action={signOutAction}>
        <Button type="submit">Sign Out</Button>
      </form>
    </div>
  );
}
