import React,{useEffect, useState} from "react";

function Create(){
    const [id,setId]= useState("")
    const [entry, setEntry]= useState("") 
    const [date,setDate]= useState("")
    const [precedence,setPrecedence]= useState("")
    const [done,setdone]= useState("")
    function saveTodo()
    {   
        console.log("save tusuna basildi")
        console.warn(id,entry,date,precedence,done)
        let data ={id,entry,date,precedence,done}
        fetch('http://localhost:8088/api/create',{
        method:'POST',
        //hedader
        body:JSON.stringify(data)
    })
    .then((result) =>{
        console.warn("result", result);
        result.json().then((response)=>{
            console.warn("resp",response)
        })
    })

    }
    return(
        <div className="Create">
            <h1> post api example</h1>
            <input type="text" value={id} onChange={(e) =>{setId(e.target.value)}} name = "id" /> <br/><br/>
            <input type="text" value={entry} onChange={(e) => {setEntry(e.target.value)}} name = "entry" /> <br/> <br/>
            <input type="text" value={date} onChange = {(e) => {setDate(e.target.value)}} name = "date" /> <br/> <br/>
            <input type="text" value={precedence} onChange = {(e) => {setPrecedence(e.target.value)}} name = "presedence" /> <br/> <br/>
            <input type="text" value={done} onChange = {(e) => {setdone(e.target.value)}} name = "done" /> <br/> <br/>
            <button type="botton" onClick={saveTodo}>Save new Todo</button>
        </div>
    )
}
export default Create;