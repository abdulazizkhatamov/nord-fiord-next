"use client";
import { signOut } from "@/lib/auth-client";
import { Button, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <div>
      <Text>HI, Welcome back !</Text>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          await signOut({
            fetchOptions: {
              onSuccess: () => {
                router.push("/admin/signin");
              },
            },
          });
        }}
      >
        <Button type="submit">Sign Out</Button>
      </form>
    </div>
  );
}
