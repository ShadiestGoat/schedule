import { Fragment, FunctionComponent } from "preact";
import { Link } from "preact-router";
import { useCallback, useRef, useState } from "preact/hooks";
import { getV, schedualTot, timePeriod, unknownClass, useGlobalListener, useOnClickOutside } from "../../tools"
import style from "./style.css"

type MenuInfo = {on:boolean, id: string, date: number, n: boolean, newInfo: {teacher: string, class: string}}

function addClass(layout:schedualTot['layout'], times:schedualTot['times'], p: number, i:number):{
    newT: schedualTot['times'],
    newSh: schedualTot['layout']
} {
    const newSh = {...layout}
    const t = [...times]
    t[i].pop()
    Object.keys(newSh).forEach(day => {
        newSh[day as keyof schedualTot['layout']].splice(p + 1, 0, unknownClass)
    })
    return {
        newT: t,
        newSh
    }
}

function yoinkClass(layout:schedualTot['layout'], times:schedualTot['times'], p: number, i:number):{
    newT: schedualTot['times'],
    newSh: schedualTot['layout']
} {
    const newSh = {...layout}
    const t = [...times]
    t[i][2] = "Break"
    Object.keys(newSh).forEach(day => {
        newSh[day as keyof schedualTot['layout']].splice(p, 1)
    })
    return {
        newT: t,
        newSh
    }
}



const SelectMenu:FunctionComponent<{useBig?:boolean, options:string[], aliases:schedualTot['aliases'], remove:(name:string) => void, deselect:() => void, onUpdateAlias:(alias:string, info:schedualTot['aliases']['']) => void, onSelect:() => void, p:number, day:string, selected: boolean, selectedOption:string, onItemSelected: (opt:string) => void}> = ({useBig, deselect, remove, aliases, selectedOption, options, p, day, onSelect, selected, onItemSelected, onUpdateAlias}) => {
    const [menuInfo, setInfo] = useState<MenuInfo>({
        id: "",
        on: false,
        date: 0,
        n: false,
        newInfo: {
            class: "",
            teacher: ""
        }
    })
    useBig = useBig ?? false

    const refMenu = useRef<HTMLDivElement>(null)
    const refClick = useRef<HTMLDivElement>(null)

    useOnClickOutside(refMenu, () => {
        if (menuInfo.on) {
            setInfo({
            id: "",
            on: false,
            date: 0,
            n: false,
            newInfo: {
                class: "",
                teacher: ""
            }
            })
            deselect()
        }
    })
    useOnClickOutside(refClick, () => {
        if (selected) deselect()
    })

    return <div ref={refClick} > {menuInfo.on ? <div>
    <div class={style.backDrop} />
    <div ref={refMenu} class={`row ${style.menuOpen}`}>
        <div class="col" >
            <label class="row" style={{justifyContent: "space-between", width: "95%", marginTop: "1vh"}}>
                <h4> Id </h4>
                <input value={menuInfo.id} onInput={(e):void => {
                    if (!menuInfo.n) return
                    const sh = {...menuInfo}
                    sh.id = (e.target as HTMLInputElement).value
                    setInfo(sh)
                }} disabled={!menuInfo.n} />
            </label>
            <label class="row" style={{justifyContent: "space-between", width: "95%", marginTop: "2vh"}}>
                <h4>Teacher </h4>
                <input value={menuInfo.newInfo.teacher} onInput={(e):void => {
                    const newS = {...menuInfo}
                    newS.newInfo.teacher = (e.target as HTMLInputElement).value
                    setInfo(newS)
                }} />
            </label>
            <label class="row" style={{justifyContent: "space-between", width: "95%", marginTop: "2vh"}}>
                <h4>Class Name </h4>
                <input value={menuInfo.newInfo.class} onInput={(e):void => {
                    const newS = {...menuInfo}
                    newS.newInfo.class = (e.target as HTMLInputElement).value
                    setInfo(newS)
                }} />
            </label>
            <div class="row" style={{marginTop: "2vh"}}>
                <div class="btn btn-p" onClick={():void => {
                    if (menuInfo.id.trim()) onUpdateAlias(menuInfo.id, {
                        fullName: menuInfo.newInfo.class,
                        teacher: menuInfo.newInfo.teacher
                    })
                    setInfo({date: 0, id: "", on: false, n: false, newInfo: {teacher: "", class: ""}})
                }}>{menuInfo.n ? "Save" : "Update"}</div>
            </div>
        </div>
    </div>
</div> : <div onClick={():void => {
        onSelect()
    }} class={`row ${style.selectMenu}`} style={{width: useBig ? "22vw" : ''}}>
        {
            <div style={{position: "absolute", zIndex: "99", height: `${selected ? (options.length + 1) * 2.5 : 2.5}vh`}} class="col"> {
                selected ? <Fragment>
                                {options.map((v, i) => {
                return <div key={`mn-${v}-${p}-${day}`} style={Object.assign({borderRadius: "0px", height: "2.5vh", width: useBig ? "22vw" : ""}, !i ? {borderTopLeftRadius: "6.25px", borderTopRightRadius: "6.25px"} : {}, v == selectedOption ? {boxShadow: "0px 0px 15px 1px #207a91"} : {})} class={`row ${style.selectMenu} ${style.menuRow}`}>
                    {useBig ? <h3 style={{fontSize: "2vw", width: "55%"}} onClick={():void => {
                        console.log('b', selected)
                        onItemSelected(v)
                        console.log('a', selected)
                    }}>{v}</h3> :
                    <h6 style={{width: "55%"}} onClick={():void => {
                        onItemSelected(v)
                    }}>{v}</h6>}
                    <div style={{width: "45%"}}>
                        <svg width={"50%"} style={{fill: "#fff"}} onClick={():void => {
                            setInfo({
                                id: v,
                                on: true,
                                date: Date.now(),
                                n: false,
                                newInfo: {
                                    class: aliases[v].fullName,
                                    teacher: aliases[v].teacher
                                }
                            })
                        }} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeWidth="0.5" d="m23.39 1.992-1.384-1.384c-0.1434-0.1433-0.3757-0.1433-0.5191 0l-2.508 2.508-0.7785-0.7785c-0.06886-0.06887-0.1622-0.1075-0.2596-0.1075s-0.1906 0.03868-0.2596 0.1075l-1.497 1.497c-0.2971-0.1966-0.646-0.3023-1.012-0.3023-0.4913 0-0.9522 0.1903-1.298 0.5357l-4.973 4.973c-0.1433 0.1433-0.1433 0.3757 0 0.519 0.07165 0.0717 0.1656 0.1075 0.2595 0.1075s0.1879-0.0358 0.2595-0.1075l4.973-4.973c0.2068-0.2068 0.4833-0.3207 0.7785-0.3207 0.1671 0 0.3276 0.03769 0.4734 0.1068l-11.72 11.72c-0.00145 0.0014-0.00261 3e-3 -4e-3 0.0044-0.00503 0.0053-0.00993 0.01065-0.01473 0.01631-0.00368 0.0043-0.00727 0.0086-0.01078 0.01299-0.00359 0.0046-0.00701 0.0094-0.01038 0.01415-0.00409 0.0058-0.00814 0.01163-0.01186 0.01765-0.00111 0.0017-0.00239 0.0034-0.00346 0.0052l-2.595 4.325c-0.08666 0.1444-0.06392 0.3293 0.05521 0.4484l0.1003 0.1003-0.6193 0.6193c-0.4217 0.4217-0.4217 1.108 0 1.53 0.2109 0.2109 0.4879 0.3163 0.7648 0.3163 0.2769 0 0.554-0.1054 0.7648-0.3163l0.6193-0.6194 0.1003 0.1003c0.07075 0.07075 0.1647 0.1075 0.2596 0.1075 0.06482 0 0.1301-0.01712 0.1887-0.05233l4.325-2.595c0.00152-9.39e-4 0.00283-2e-3 0.00436-0.0029 0.0067-0.0042 0.01325-0.0086 0.01972-0.01321 0.00404-0.0029 0.00814-0.0058 0.01208-0.0088 0.00508-0.0039 0.01006-0.0081 0.015-0.01249 0.00485-0.0042 0.00966-0.0084 0.01419-0.01285 0.00175-0.0016 0.00364-0.0031 0.00535-0.0049 8.875e-4 -9.58e-4 13.75-13.75 13.75-13.75 0.1433-0.1433 0.1433-0.3757 0-0.519l-0.7785-0.7786 2.508-2.508c0.1433-0.1433 0.1433-0.3757 4.5e-5 -0.519zm-21.57 20.67c-0.06568 0.06564-0.1529 0.1018-0.2458 0.1018-0.09285 0-0.1801-0.03616-0.2458-0.1018-0.06563-0.06567-0.1018-0.1529-0.1018-0.2458 0-0.09285 0.03616-0.1801 0.1018-0.2458l0.6193-0.6193 0.4915 0.4915zm5.824-3.374-0.4325-0.4325c-0.1433-0.1433-0.3757-0.1433-0.519 0-0.1433 0.1433-0.1433 0.3757 0 0.519l0.3596 0.3596-3.677 2.206-1.325-1.325 2.206-3.677 1.398 1.398c0.07165 0.07169 0.1656 0.1075 0.2595 0.1075 0.09389 0 0.1879-0.0358 0.2595-0.1075 0.1433-0.1433 0.1433-0.3757 0-0.519l-1.471-1.471 11.5-11.5 2.941 2.941zm13.23-13.23-1.211 1.211-2.941-2.941 1.211-1.211 0.7779 0.7779c0.0012 0.00127 1.384 1.384 1.384 1.384 0.0011 0.00109 0.7792 0.7792 0.7792 0.7792zm-0.5191-1.557-0.8651-0.8651 2.249-2.249 0.8651 0.8651z" />
                        </svg>

                        <svg width={"50%"}style={{fill: "#fff"}} onClick={():void => {remove(v)}} role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeWidth="0.25" d="m15.37 12 7.43-7.427c0.9329-0.9328 0.9329-2.438 0-3.371-0.9329-0.9328-2.438-0.9328-3.371 0l-7.43 7.427-7.428-7.428c-0.9329-0.9328-2.438-0.9328-3.371 0-0.9329 0.9328-0.9329 2.438 0 3.371l7.43 7.427-7.43 7.427c-0.9329 0.9328-0.9329 2.438 0 3.371 0.9347 0.9328 2.445 0.9328 3.371 0l7.43-7.427 7.43 7.427c0.9329 0.9328 2.438 0.9328 3.371 0 0.9256-0.9328 0.9256-2.438-0.0086-3.373z" />
                        </svg>
                    </div>
                    </div>
            })}
                <div class={`row ${style.selectMenu} ${style.menuRow}`} style={Object.assign({borderRadius: "0px", marginTop: "0px", borderBottomLeftRadius: "6.25px", borderBottomRightRadius: "6.25px", borderTop: "white solid 2px", paddingBottom: useBig ? "25px" : "3px"}, useBig ? {width: "22vw", height: "2.5vh"} : {})}>
                {useBig ?
                    <h3 style={{fontSize: "2vw"}}
                    onClick={():void => {
                        setInfo({
                            date: Date.now(),
                            id: '',
                            n: true,
                            on: true,
                            newInfo: {
                                class: "",
                                teacher: ""
                            }
                        })
                    }}
                    >Add new</h3> :
                    <h6 class={`row ${style.selectMenu}`}
                    onClick={():void => {
                        setInfo({
                            date: Date.now(),
                            id: '',
                            n: true,
                            on: true,
                            newInfo: {
                                class: "",
                                teacher: ""
                            }
                        })
                    }}>Add new</h6>}
                </div>
                </Fragment> : <Fragment />
            }
            </div>
        }
        {useBig ? <h3 style={{fontSize: "2vw"}}>{selectedOption}</h3> : <h6>{selectedOption}</h6>}
    </div>}
    </div>
}

const SchedualCreator:FunctionComponent = () => {
    let breaks = 0
    const shI:Record<number, number> = {}
    const [times, setTimes] = useState<timePeriod[]>(JSON.parse(localStorage.getItem('sch') ?? "{}").times)
    const [layout, setLayout] = useState<schedualTot['layout']>(JSON.parse(localStorage.getItem('sch') ?? "{}").layout)
    const [classes, setClasses] = useState<schedualTot['aliases']>(JSON.parse(localStorage.getItem('sch') ?? "{}").aliases)
    const [menuOpen, setMenuOpen] = useState<string>('999')
    const [vertMode, setVerticalMode] = useState<boolean>(getV())
    const [vertDay, setVertDay] = useState<string>("times")

    useGlobalListener('resize', () => {
        if (vertMode != getV() && vertMode) setVertDay("times")
        setVerticalMode(getV())
    })

    const save = useCallback(() => {
        localStorage.setItem('sch', JSON.stringify({
            aliases: classes,
            layout,
            times
        } as schedualTot))
    }, [times, layout, classes])

    const days:(keyof schedualTot['layout'])[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
    return <div>{vertMode ? <div class="row">
        <div class="col">
            <select value={vertDay}  style={{marginTop: "3vh", fontSize: "2vw", width: "50vw", height: "2.5vh"}} onChange={(e):void => setVertDay((e.target as HTMLInputElement)?.value)}>
                {['times'].concat(Object.keys(layout)).map(day => <option key={`opt-${day}`} value={day}>{day[0].toUpperCase() + day.substr(1)}</option>
                )}
            </select>
            <div class={vertDay == "times" ? "col" : ""} style={{width: vertDay == "times" ? "80vw" : "100%", marginTop: "6vh"}}>
                {vertDay == "times" ?
                    <div style={{justifyContent:"space-between"}} class="row">
                        <h2 style={{width: "20vw", fontSize: "3.5vw"}}>Period</h2>
                        <h2 style={{width: "20vw", fontSize: "3.5vw"}}>Break</h2>
                        <h2 style={{width: "20vw", fontSize: "3.5vw"}}>Start</h2>
                        <h2 style={{width: "20vw", fontSize: "3.5vw"}}>End</h2>
                </div> : <Fragment />}
        {
            times.map((v, i) => {
                let currentlyBreak = false
                if (v.length == 3) {breaks++; currentlyBreak = true}
                shI[i] = breaks
                if (vertDay == "times") return <div class="row" style={{justifyContent:"space-between", marginTop: "4vh"}}>
                    {times[i].length == 3 ?
                        <label style={{width: "18vw", margin: "0px auto", height: "3.9vh"}}>
                            <input value={times[i][2]} style={{width: "100%", height: "100%"}} onInput={(e):void => {
                                const t = [...times]
                                t[i][2] = (e.target as HTMLInputElement)?.value
                                setTimes(t)
                                save()
                            }} />
                        </label>
                    : <h2 style={{width: "20vw"}}>{i-shI[i] + 1}</h2>}

                    <input style={{width: "18vw", height: "3vw", margin: "auto 1vw"}}
                        type="checkbox"
                        checked={times[i].length == 3}
                        onClick={():void => {
                            let res
                            if (times[i].length == 3) res = addClass({...layout}, [...times], i - shI[i], i)
                            else res = yoinkClass({...layout}, [...times], i - shI[i], i)
                            setTimes(res.newT)
                            setLayout(res.newSh)
                            save()
                    }} />

                    <input style={{width: "18vw", margin: "0px 1vw"}} class={style.clock} value={v[0]} onInput={(e):void => {
                        const newArr= times.splice(0)
                        newArr[i][0] = (e.target as HTMLInputElement).value
                        setTimes(newArr)
                        save()
                    }} type="time" />
                    <input style={{width: "18vw", margin: "0px 1vw"}} step="300" class={style.clock} value={v[1]} onInput={(e):void => {
                        const newArr= times.splice(0)
                        newArr[i][1] = (e.target as HTMLInputElement).value
                        setTimes(newArr)
                        save()
                    }} type="time" />
                </div>
                return <div class="row" style={{marginTop: "3vh"}} key={`sh-${i}-${vertDay}`}>
                    <div class="col"><h2>{currentlyBreak ? times[i][2] : `P-${i - breaks + 1}`}</h2></div>
                    <div class="col"> {
                        currentlyBreak ? <div class="bar" style={{height: "100%", width: "52%"}}> </div> : <Fragment>
                        <div class="row" style={{justifyContent: "center"}}>
                            <h2 style={{marginRight: "3vw", fontSize: "2.2vw", marginTop: "0px"}} onClick={():void => {
                                const newSh = {...layout}
                                newSh[vertDay as keyof schedualTot['layout']][i-shI[i]].study = !(newSh[vertDay as keyof schedualTot['layout']][i-shI[i]].study ?? false)
                                setLayout(newSh)
                                save()
                            }}> Study </h2>
                            <input value={layout[vertDay as keyof schedualTot['layout']][i - breaks].location} style={{width: "18vw", outline: "0px", height: "3vw", fontSize: "2vw"}} />
                        </div>
                        <div class="row" style={{justifyContent: "center", marginTop: "1vh"}}>
                            <input
                                style={{margin: "0.2vw", width: "2.6vw", height: "2.6vw", marginRight: "2vw"}}
                                type="checkbox"
                                checked={layout[vertDay as keyof schedualTot['layout']][i-breaks].study}
                                onClick={():void => {
                                    const newSh = {...layout}
                                    newSh[vertDay as keyof schedualTot['layout']][i-shI[i]].study = !(newSh[vertDay as keyof schedualTot['layout']][i-shI[i]].study ?? false)
                                    setLayout(newSh)
                                    save()
                                }}
                                />
                            <SelectMenu
                                aliases={classes}
                                useBig={true}
                                remove={(name):void => {
                                    const newCl = {...classes}
                                    delete newCl[name]
                                    setClasses(newCl)
                                    save()
                                }}
                                onUpdateAlias={(alias, info):void => {
                                    const newAl = {...classes}
                                    newAl[alias] = info
                                    setClasses(newAl)
                                    save()
                                }}
                                deselect={():void => {
                                    setMenuOpen(`999`)
                                }}
                                onItemSelected={(opt):void => {
                                    const newSh = {...layout}
                                    newSh[vertDay as keyof schedualTot['layout']][i - shI[i]].subject = opt
                                    setLayout(newSh)
                                    save()
                                }}
                                selected={`${i}-${vertDay}` == menuOpen}
                                day={vertDay}
                                p={i}
                                selectedOption={layout[vertDay as keyof schedualTot['layout']][i - breaks].subject}
                                onSelect={():void => {
                                    setMenuOpen(`${i}-${vertDay}` == menuOpen ? `999` : `${i}-${vertDay}`)
                                }} options={Object.keys(classes)} />
                        </div>

                        </Fragment>
                    }
                     </div>
                </div>
            })
        }
    </div></div>
    </div>
     : <div class="row" style={{margin: "4vh auto 0px", width:"89vw" }}>
        <div class="col">
            <div class="row">
                <div class="col"><h3>Times</h3></div>
                {days.map(day => <div key={`hr-${day}`} class="col"><h3>{day[0].toUpperCase() + day.substr(1)}</h3></div>)}
            </div>
            {
                times.map((v, i) => {
                    if (v.length == 3) breaks++
                    shI[i] = breaks
                    return <div key={i} style={{marginTop: "3vh"}} class="row">
                    <div class="col">
                        <div class="row">
                            <div class="col" style={{justifyContent: "space-between"}}>
                                <label style={{justifyContent:"space-between"}} class="row">
                                    <h6>Start</h6>
                                    <input style={{width:"5.5vw", marginLeft: "1vw"}} class={style.clock} value={v[0]} onInput={(e):void => {
                                        const newArr= times.splice(0)
                                        newArr[i][0] = (e.target as HTMLInputElement).value
                                        setTimes(newArr)
                                        save()
                                        }} type="time" />
                                </label>
                                <label style={{justifyContent:"space-between"}} class="row">
                                    <h6>End</h6>
                                    <input style={{width:"5.5vw", marginLeft: "1vw"}} step="300" class={style.clock} value={v[1]} onInput={(e):void => {
                                        const newArr= times.splice(0)
                                        newArr[i][1] = (e.target as HTMLInputElement).value
                                        setTimes(newArr)
                                        save()
                                        }} type="time" />
                                </label>
                            </div>
                            <div class="col">
                                <label style={{justifyContent: "center"}}>
                                    <h6> Break </h6>
                                    <input type="checkbox" onClick={():void => {
                                        let t = [...times]
                                        let newSh = {...layout}
                                        if (t[i].length == 3) {
                                            // currently break
                                            const res = addClass(newSh, t, i - (shI[i]), i)
                                            newSh = res.newSh
                                            t = res.newT
                                        }
                                        else {
                                            // enable break
                                            const res = yoinkClass(newSh, t, i - (shI[i]), i)
                                            newSh = res.newSh
                                            t = res.newT
                                        }
                                        setTimes(t)
                                        setLayout(newSh)
                                        save()
                                    }}
                                    checked={times[i].length == 3}
                                    />
                                </label>
                                {
                                    v.length == 3 ?
                                        <input style={{width: '90%', margin: 'auto 5px', borderRadius: "6.25px"}}
                                        value={v[2]}
                                        />
                                    : <Fragment />

                                }
                            </div>
                        </div>
                    </div>
                    {times[i].length == 3 ?
                    days.map(day => <div class="col" key={`sh-${day}`}> <div class="bar" style={{height: "100%", width: "52%"}}> </div> </div>)
                     : days.map(day => {
                        return <div class="col" key={`sh-${day}`}>
                        <label class="row" style={{justifyContent: "center"}}>
                            <h6> Study Period </h6>
                            <input
                            style={{margin: "auto 5px"}}
                            type="checkbox"
                            checked={layout[day][i-breaks].study}
                            onClick={():void => {
                                const newSh = {...layout}
                                newSh[day][i-breaks].study = !(newSh[day][i-breaks].study ?? false)
                            }}
                            />
                        </label>
                        <label>
                            <input style={{borderRadius: "6.25px", width: "4vw", marginBottom: "0.5vh"}} value={layout[day][i - shI[i]].location} onInput={(e):void => {
                                const newSh = {...layout}
                                newSh[day][i - shI[i]].location = (e.target as HTMLInputElement).value
                                setLayout(newSh)
                                save()
                            }} />
                        </label>

                        <SelectMenu
                            aliases={classes}
                            useBig={false}
                            remove={(name):void => {
                                const newCl = {...classes}
                                delete newCl[name]
                                setClasses(newCl)
                                save()
                            }}
                            onUpdateAlias={(alias, info):void => {
                                const newAl = {...classes}
                                newAl[alias] = info
                                setClasses(newAl)
                                save()
                            }}
                            deselect={():void => {
                                setMenuOpen(`999`)
                            }}
                            onItemSelected={(opt):void => {
                                const newSh = {...layout}
                                newSh[day][i - shI[i]].subject = opt
                                setLayout(newSh)
                                save()
                            }}
                            selected={`${i}-${day}` === menuOpen}
                            day={day}
                            p={i}
                            selectedOption={layout[day][i - breaks].subject}
                            onSelect={():void => {
                                setMenuOpen(`${i}-${day}` === menuOpen ? `999` : `${i}-${day}`)
                            }} options={Object.keys(classes)} />
                     </div>})
                     }
                </div>})
            }
        </div>
    </div>}
    <Link href="/" alt="Home">
        <svg style={{top: `1vh`, left: `1vw`, position: "absolute", fill: "#fff"}} width="4vh" height="4vh" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m21.31 3.797h-2.364l0.0099 2.867 2.354 1.998zm-21.17 8.314s0.7512 1.386 2.393 0l9.805-8.295 9.192 8.243c1.899 1.37 2.611 0 2.611 0l-11.8-10.69zm3.263 9.985s-0.02183 0.5366 0.5029 0.5366c0.653 0 6.05-0.0073 6.05-0.0073l0.0091-4.957s-0.08549-0.8167 0.7066-0.8167h2.511c0.9376 0 0.8803 0.8167 0.8803 0.8167l-0.01087 4.942h5.922c0.6657 0 0.6357-0.6675 0.6357-0.6675v-9.141l-8.347-7.424-8.86 7.425v9.294z" strokeWidth="0.25" />
        </svg>
    </Link>
</div>
}

export default SchedualCreator
