import { RefObject } from 'preact';
import { useRef, useEffect, useCallback } from 'preact/hooks';

export function rand(min: number, max: number): number {
    return Math.floor(Math.random()*(max-min+1)+min)
}

export function useGlobalListener<K extends keyof WindowEventMap>(type:K, handler:(e:WindowEventMap[K]) => void, capture = false, passive = false):void {
    const cur = useRef(handler);
    cur.current = handler;
    const proxy = useCallback((e:WindowEventMap[K]) => cur.current(e), []);
    useEffect(() => {
      const opts = passive ? { passive, capture } : capture;
      addEventListener(type, proxy, opts);
      return ():void => removeEventListener(type, proxy, opts);
    }, [type, capture, passive, proxy]);
}

export type timePeriod = [string, string, string?]

export type classT = {
    location: string,
    subject: string,
    study?: boolean
}

export type fullClassInfo = {
    location: string,
    name: string,
    study: boolean,
    period: number,
    teacher: string,
    breakName?: string
}

export const homeClass:fullClassInfo = {
    location: `P1`,
    name: "home",
    period: 99,
    study: false,
    teacher: "",
}

export const unknownClass:classT = {
    location: "unknown",
    subject: "unknown",
    study: false,
}

export const breakClass:fullClassInfo = {
    location: ``,
    name: "break",
    period: 99,
    study: false,
    teacher: "",
}

export const weekend:fullClassInfo = {
    location: `P1`,
    name: "weekend",
    period: 99,
    study: false,
    teacher: "",
}

export type schedualTot = {
    times: timePeriod[],
    layout: {
        monday: classT[],
        tuesday: classT[],
        wednesday: classT[]
        thursday: classT[],
        friday: classT[]
    },
    aliases: Record<string, {
        teacher: string,
        fullName: string
    }>
}

export const getV = ():boolean => window.innerHeight >= window.innerWidth

export function useOnClickOutside(ref:RefObject<HTMLDivElement>, handler:(e:MouseEvent) => void):void {
  useEffect(
    () => {
      const listener = (event:unknown):void => {
        if (!ref.current || ref.current.contains((event as MouseEvent)?.target as null)) return

        handler(event as MouseEvent);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return ():void => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    [ref, handler]
  );
}
