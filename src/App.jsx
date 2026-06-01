import React from "react";
import { Counter } from "./components/function_based_component/Hooks/Counter";
import {Theme} from "./components/function_based_component/Hooks/Theme";
import {Updater} from "./components/function_based_component/Hooks/Updater";

const App = () => {
  // java script codes
  // let topicHeading ="React java Script Components";
  // Xml Codes
  return(
    // empty fragments
    <>
    {/* <h1 style={{textAlign:"center",fontSize:"5vw",fontFamily:"system-ui",color:"navy",backgroundColor:"lightgray",borderRadius:"20px"}}>{topicHeading}</h1>
    <ClassBasedComponent/>
    <FunctionBasedComponent/> */}
    {/* <HeaderComponent/>
    <FooterComponent/> */}

    <Counter />
    <Theme />
    <NameUpdater />

    </>
  )
}
export default App;