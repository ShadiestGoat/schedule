import { Fragment, FunctionComponent } from "preact";
import { Link } from "preact-router";
import { useState } from "preact/hooks";
import { fullClassInfo, getV, useGlobalListener } from "../../tools"

const ClassInfo:FunctionComponent<fullClassInfo & {after?: fullClassInfo}> = ({name, location, study, breakName, after}) => {
    const specialCases = ["home", "break", "weekend"]
    const specialNames:Record<string, string> = {
        home: "Home!",
        study: "Study",
        break: breakName ?? "",
        weekend: "It's the Weekend!"
    }
    const sub = study ? `But HLs have ${name}` : breakName && after ? after.study ? `Next up.. Study period!`  : `Next up.. ${after?.name} in ${after?.location}` : ""
    return <div>
        <h1 style={{color: specialCases.includes(name) || study ? "#25a125" : ""}}>{study ? specialNames.study : specialCases.includes(name) ? specialNames[name] : name}</h1>
        {specialCases.includes(name) || sub ? <Fragment /> : <h2>{`In ${location}`}</h2>}
        {sub ? <h2 style={{marginTop: "0.5vh"}}>{sub}</h2> : <Fragment />}
    </div>
}

const Bar:FunctionComponent = () => <div class="bar" style={{height: "1vh",  width: "9vw", marginTop:"1vh", marginBottom: "1vh"}} />

const DisplayComp:FunctionComponent<{current:fullClassInfo, next:fullClassInfo, after?:fullClassInfo, notInited:boolean}> = ({ current, next, after, notInited }) => {
    const [vert, setVert] = useState<boolean>(getV())
    useGlobalListener("resize", () => {
        setVert(getV())
    })
    return <div>
        {notInited ? <div style={{marginTop: "35vh"}} class="col">
            <h1>You have no classes added!</h1>
        </div> : <div class={vert ? "col" : "row"} style={{width: "60%", margin: "auto auto", marginTop:vert ? "0px" : "27vh", height: vert ? "95vh" : ""}}>
            <div class="col">
                <h1> Now </h1>
                <Bar />
                <ClassInfo location={current.location} name={current.name} period={current.period} breakName={current.breakName} study={current.study} teacher={current.teacher} />
            </div>
            <div class="col">
                <h1> Next </h1>
                <Bar />
                <ClassInfo after={after} location={next.location} name={next.name} period={next.period} breakName={next.breakName} study={next.study} teacher={next.teacher} />
            </div>
        </div>
        }
        <Link href="/creator" alt="Schedual Setup">
            <svg style={{top: `1vh`, left: `1vw`, position: "absolute", fill: "#fff"}} width="4vh" height="4vh" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="m12 9.166c-1.563 0-2.834 1.271-2.834 2.834 0 1.563 1.271 2.834 2.834 2.834s2.834-1.271 2.834-2.834c0-1.563-1.271-2.834-2.834-2.834zm0 4.037c-0.6633 0-1.203-0.5397-1.203-1.203s0.5397-1.203 1.203-1.203 1.203 0.5397 1.203 1.203-0.5397 1.203-1.203 1.203zm11.34 1.53-1.472-0.8496c0.1175-0.6188 0.1768-1.25 0.1768-1.884s-0.05931-1.265-0.1768-1.884l1.472-0.8496c0.1873-0.1081 0.324-0.2862 0.38-0.4953 0.056-0.2089 0.02667-0.4315-0.08145-0.6188l-2.485-4.305c-0.2252-0.39-0.7236-0.5236-1.114-0.2985l-1.473 0.8506c-0.9593-0.8282-2.069-1.47-3.261-1.885v-1.698c0-0.4504-0.3652-0.8156-0.8156-0.8156h-4.971c-0.4504 0-0.8156 0.3652-0.8156 0.8156v1.699c-1.192 0.4153-2.302 1.057-3.261 1.885l-1.473-0.8507c-0.3902-0.2253-0.889-0.09155-1.114 0.2985l-2.485 4.305c-0.1081 0.1873-0.1375 0.4099-0.08145 0.6188 0.056 0.209 0.1926 0.3871 0.38 0.4953l1.472 0.8496c-0.1175 0.6188-0.1768 1.25-0.1768 1.884 0 0.6339 0.05931 1.265 0.1768 1.884l-1.472 0.8496c-0.1873 0.1081-0.324 0.2862-0.38 0.4953-0.056 0.2089-0.02667 0.4315 0.08145 0.6188l2.485 4.305c0.2252 0.3901 0.7238 0.5238 1.114 0.2985l1.473-0.8506c0.9593 0.8282 2.069 1.47 3.261 1.885v1.699c0 0.4504 0.3652 0.8156 0.8156 0.8156h4.971c0.4504 0 0.8156-0.3652 0.8156-0.8156v-1.699c1.192-0.4153 2.302-1.057 3.261-1.885l1.473 0.8506c0.3903 0.2252 0.889 0.09147 1.114-0.2985l2.485-4.305c0.1081-0.1873 0.1375-0.4099 0.08145-0.6188-0.056-0.2091-0.1926-0.3872-0.38-0.4954zm-3.187-4.823c0.1735 0.6791 0.2615 1.382 0.2615 2.089s-0.088 1.41-0.2615 2.089c-0.09058 0.3543 0.06578 0.7254 0.3824 0.9082l1.283 0.7408-1.67 2.892-1.285-0.7421c-0.3168-0.1828-0.7168-0.1325-0.9781 0.1233-1.011 0.9894-2.261 1.712-3.615 2.09-0.3525 0.09834-0.5963 0.4196-0.5963 0.7855v1.482h-3.34v-1.482c0-0.366-0.2438-0.6872-0.5963-0.7855-1.354-0.3779-2.604-1.1-3.615-2.09-0.2616-0.2558-0.6615-0.3061-0.9781-0.1233l-1.285 0.7421-1.67-2.892 1.283-0.7408c0.3166-0.1828 0.473-0.5539 0.3824-0.9082-0.1735-0.6791-0.2615-1.382-0.2615-2.089s0.088-1.41 0.2615-2.089c0.09058-0.3543-0.06578-0.7254-0.3824-0.9082l-1.283-0.7408 1.67-2.892 1.285 0.7421c0.3169 0.1829 0.7168 0.1325 0.9781-0.1233 1.011-0.9894 2.261-1.712 3.615-2.09 0.3525-0.09834 0.5963-0.4196 0.5963-0.7855v-1.482h3.34v1.482c0 0.366 0.2438 0.6872 0.5963 0.7855 1.354 0.3779 2.604 1.1 3.615 2.09 0.2617 0.2559 0.6615 0.3062 0.9781 0.1233l1.285-0.7421 1.67 2.892-1.283 0.7408c-0.3165 0.1828-0.4729 0.5539-0.3824 0.9082z" strokeWidth="0.25" />
            </svg>
        </Link>
    </div>
}

export default DisplayComp
