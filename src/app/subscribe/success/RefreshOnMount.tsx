"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

/** Nudge the JWT/session to pick up the new subscription after checkout. */
export function RefreshOnMount() {
  const router = useRouter();
  const { update } = useSession();

  useEffect(() => {
    const t1 = setTimeout(() => {
      update();
      router.refresh();
    }, 2500);
    const t2 = setTimeout(() => {
      update();
      router.refresh();
    }, 6000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [router, update]);

  return null;
}
