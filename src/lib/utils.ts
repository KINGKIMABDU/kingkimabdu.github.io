import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
 * Pen counts as hover, touch does not.
 *
 * An Apple Pencil held over an iPad is a real hover: Safari reports it as
 * pointerType "pen" and fires enter/leave exactly like a mouse. Mouse events
 * are only synthesised for it as a compatibility afterthought, so the pointer
 * events are the ones worth listening to. A finger is filtered out on
 * purpose — everything guarded by this opens on enter and closes on leave,
 * and a touch that opens something with no leave event to close it leaves the
 * user stuck looking at it.
 */
export function isHoverPointer(e: { pointerType: string }) {
  return e.pointerType === "mouse" || e.pointerType === "pen";
}
