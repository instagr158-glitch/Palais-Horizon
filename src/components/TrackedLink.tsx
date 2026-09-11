"use client";

import Link from "next/link";
import { track } from "@vercel/analytics";
import type { ComponentProps } from "react";

type Props = ComponentProps<typeof Link> & {
  event: string;
  location: string;
};

/** A next/link that also fires a named Vercel Analytics click event. */
export function TrackedLink({ event, location, onClick, ...rest }: Props) {
  return (
    <Link
      {...rest}
      onClick={(e) => {
        track(event, { location });
        onClick?.(e);
      }}
    />
  );
}
