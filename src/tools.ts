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


export const breakClass:fullClassInfo = {
    location: `P1`,
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

export const testSchechual:schedualTot = {
    times: [
        ['08:35', '09:30'],
        ['09:30', '10:30'],
        ['10:30', '10:50', "Break"],
        ['10:50', '11:45'],
        ['11:45', '12:45'],
        ['12:45', '13:45', "Lunch"],
        ['13:45', '14:40'],
        ['14:40', '15:40'],
    ],
    layout: {
        monday: [
            {
                location: 'E7',
                subject: 'bz'
            },
            {
                location: 'W10',
                subject: 'eco'
            },
            {
                location: 'W9',
                subject: 'math'
            },
            {
                location: 'W14',
                subject: 'phy'
            },
            {
                location: 'E4', //FIXME: this is wrong
                subject: 'eng',
                study: true
            },
            {
                location: 'E7',
                subject: 'span'
            }
        ],
        tuesday: [
            {
                location: 'E5',
                subject: 'math'
            },
            {
                location: 'W12',
                subject: 'span'
            },
            {
                location: 'E5',
                subject: 'core'
            },
            {
                location: 'E7',
                subject: 'tok'
            },
            {
                location: 'W10',
                subject: 'eco'
            },
            {
                location: 'P1.1',
                subject: 'phy'
            }
        ],
        wednesday: [
            {
                location: 'E5',
                subject: 'eng'
            },
            {
                location: 'P1.1',
                subject: 'phy'
            },
            {
                location: 'E7',
                subject: 'tok'
            },
            {
                location: 'E7',
                subject: 'eco'
            },
            {
                location: 'E5',
                subject: 'bz'
            },
            {
                location: 'P2.1',
                subject: 'tutor'
            }
        ],
        thursday: [
            {
                location: 'E7',
                subject: 'bz'
            },
            {
                location: 'P2.2',
                subject: 'eng'
            },
            {
                location: 'W9',
                subject: 'math'
            },
            {
                location: 'W10',
                subject: 'phy'
            },
            {
                location: 'E7',
                subject: 'span'
            },
            {
                location: 'E4', //FIXME: this is wrong
                subject: 'eco',
                study: true
            }
        ],
        friday: [
            {
                location: 'E7',
                subject: 'tok'
            },
            {
                location: 'W17',
                subject: 'bz'
            },
            {
                location: 'P2.3',
                subject: 'eng'
            },
            {
                location: 'E4', //FIXME: this is wrong
                subject: 'span',
                study: true
            },
            {
                location: 'E5',
                subject: 'math'
            },
            {
                location: 'P2.1',
                subject: 'tutor'
            }
        ],

    },
    aliases: {
        bz: {
            fullName: "Buisness Management",
            teacher: "Mr. " //TODO:
        },
        tutor: {
            fullName: "Tutor (Y12.1)",
            teacher: "Ms. Fitz"
        },
        math: {
            fullName: "Maths AA",
            teacher: "Ms. Zewdi"
        },
        eng: {
            fullName: "English",
            teacher: "Ms. Blake"
        },
        eco: {
            fullName: "Economics",
            teacher: ""
        },
        tok: {
            fullName: "Theory Of Knowledge",
            teacher: "Mr. Anstis"
        },
        phy: {
            fullName: "Physics",
            teacher: "Mr. "
        },
        core: {
            fullName: "DP Core",
            teacher: "Mr. Van Hees"
        },
        span: {
            fullName: "Spanish",
            teacher: "Ms. "
        }
    }
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
