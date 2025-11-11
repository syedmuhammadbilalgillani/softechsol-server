// components/LogoutButton.tsx
"use client";

import { signOut, useSession } from "next-auth/react";

export default function LogoutButton() {
  const { status } = useSession();

  // Don't show button if not authenticated
  if (status === "unauthenticated") {
    return null;
  }

  // Show loading state
  if (status === "loading") {
    return null;
  }

  return (
    <button
      onClick={() => signOut({ callbackUrl: "/auth/signin" })}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition block w-full text-left"
    >
      Logout
    </button>
  );
}
