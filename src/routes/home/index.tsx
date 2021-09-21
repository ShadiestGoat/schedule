import { FunctionComponent, } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import "../../animations.css"
import DisplayComp from "../../components/display";
import { breakClass, fullClassInfo, homeClass, schedualTot, unknownClass, weekend } from "../../tools";


const IndexPage:FunctionComponent = () => {
    let schedual:schedualTot = JSON.parse(localStorage.getItem('sch') ?? '{}')
    if (Object.keys(schedual).length == 0) {
        const day = [unknownClass, unknownClass, unknownClass, unknownClass, unknownClass, unknownClass]
        localStorage.setItem('sch', JSON.stringify({
            aliases: {},
            layout: {
                friday: day,
                monday: day,
                thursday: day,
                tuesday: day,
                wednesday: day
            },
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
        } as schedualTot))
        schedual = JSON.parse(localStorage.getItem('sch') ?? '{}')
    }

    if (Object.keys(schedual.aliases).length == 0) return <div style={{marginTop: "35vh"}} class="col">
        <h1>You have no classes added!</h1>
    </div>

    const newN = ():number => Date.now() //used for testing stuff easier

    const [now, setNow] = useState<number>(newN() - new Date().setHours(0, 0, 0, 0))
    const nowRef = useRef<NodeJS.Timeout>();
    useEffect(() => {
        nowRef.current = setInterval(() => {
            setNow(newN() - new Date().setHours(0, 0, 0, 0));
        }, 1000);
        return ():void => {
            clearInterval(nowRef.current as NodeJS.Timeout);
        };
    }, [ nowRef, setNow ]);

    function getOffset(time: string):number {
        const [hours, mins] = time.split(':')
        if (isNaN(parseInt(hours)) || isNaN(parseInt(mins))) throw "bad data"
        return parseInt(mins) * 60 * 1000 + parseInt(hours) * 60 * 60 * 1000
    }

    function checkP():{i:number, p:number, b:boolean} {
        let p = 99
        let trueI = 0
        let i = 0
        let b = false
        let breaksD = 0

        schedual.times.forEach(([start, end]) => {
            if (schedual.times[i].length == 3) breaksD++
            if (getOffset(start) <= now && now <= getOffset(end)) {
                if (schedual.times[i].length == 3) b = true
                p = i - breaksD
                trueI = i
            }
            i++
        })

        return {
            i: trueI,
            p,
            b
        }
    }

    const period = checkP()
    let day:keyof schedualTot['layout'];
    let curClass:fullClassInfo;
    let nextClass:fullClassInfo;
    let after:fullClassInfo | undefined;

    if (period.p == 99) {
        day = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'][new Date().getDay() - (getOffset(schedual.times[0][0]) > now ? 1 : 0)] as keyof schedualTot['layout']
        if (Object.keys(schedual.layout).includes(day)) {
            const { location, subject, study } = schedual.layout[day][0]
            const { teacher, fullName } = schedual.aliases[subject] ?? {}
            nextClass = {
                location,
                name: fullName,
                study: study ?? false,
                period: 0,
                teacher
            }
        } else nextClass = weekend

        curClass = homeClass
    } else {
        day = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'][new Date().getDay() - 1] as keyof schedualTot['layout']
        const genClass = (p:number, i:number):fullClassInfo => {
            if (i - 1 > schedual.layout.friday.length) return homeClass
            if (schedual.times[i].length == 3 && schedual.times[i][2]) return Object.assign(breakClass, {breakName: schedual.times[i][2]})
            const { location, subject, study } = schedual.layout[day][p]
            const { teacher, fullName } = schedual.aliases[subject] ?? {}
            return {
                location,
                name: fullName,
                study: study ?? false,
                period: p,
                teacher
            }
        }
        curClass = genClass(period.p, period.i)
        nextClass = genClass(period.p + 1, period.i + 1)
        after = nextClass.breakName ? genClass(period.p + 1, period.i + 2) : undefined
    }

    return <DisplayComp after={after} current={curClass} next={nextClass} />
}

export default IndexPage
