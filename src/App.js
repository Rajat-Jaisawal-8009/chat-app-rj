
import './App.css';
import { IoIosLogOut } from "react-icons/io";
import { IoMdSend } from "react-icons/io";
import React, {useEffect, useState} from 'react'
import { GoogleAuthProvider, getAuth, onAuthStateChanged, signInWithPopup, signOut} from 'firebase/auth'
import {app} from './firebase'
import {addDoc, collection, getFirestore, orderBy, onSnapshot, serverTimestamp} from 'firebase/firestore'

const auth = getAuth(app);

const loginHandle = ()=>{
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
}

function App() {

  const [user, setUser] = useState(false)
  const [messages,setMessages]=useState([])
 

  useEffect(()=>{
onAuthStateChanged(auth,(userData)=>{
  setUser(userData)
})
  },[])

const logout = ()=>{
  signOut(auth)
}

////////////////////////////////

const [inputVal, setInputVal]=useState({
  username: "",
  email: "",
  mobile:""
 })

 const inputOnchange = (e)=>{
   const value = e.target.value;
   const name = e.target.name;
 
   setInputVal({...inputVal,[name] : value})
 }

///////////////////////////////

const db = getFirestore();
useEffect(()=>{
  const unsubscribe =onAuthStateChanged(auth,(data)=>{
    console.log(data,'data')
    setUser(data)
  })
  const unsubscribeForMessages= onSnapshot(collection(db,"Messages"),(snap)=>{

    setMessages(snap.docs.map((item)=>{
      const id=item.id;
      return {id,...item.data()};
    }))
  })
  return()=>{
    unsubscribe();
    unsubscribeForMessages();
  }
},[])


const handleSubmit= async(e)=>{
  e.preventDefault();
  try{
    await addDoc(collection(db,"Messages"),{
      text:inputVal.username,
      uid:user.uid,
      uri:user.photoURL,
      createdAt:serverTimestamp(),
    })
  }
  catch(error){
    alert(error)
  }
  setInputVal( {
    username: "",
    email: "",
    mobile:""
   })

}




console.log(user)

  return (
  <>
  <div>
    {user? 
    <>

    <div className='chat-Containet'>
      <div className='chat-box'>
      {
        messages?.map((val)=>(
          val.uid != "QaodAbzvLzepWcHV8cYjTgV87Bo1"? <div className='chat-text-box-admin'><span className='text-wrap'>{val.text}</span></div> : <div className='chat-text-box-user'><span className='text-wrap'>{val.text}</span></div>
        ))
      }

<div className='form-wrap'>
      <form className='form-box' onSubmit={(e)=>handleSubmit(e)}>
      <input className='input-search'  type='text' placeholder='enter your message' value={inputVal.username} onChange={(e)=>inputOnchange(e)} name="username"/>
     
      <button  className='send-btn' type='submit'><IoMdSend /></button>
      <button onClick={logout}  className='send-btn' type='submit'><IoIosLogOut /></button>
      </form>
      </div>
      </div>

      
    </div>
    
    </>
    
    :<button onClick={loginHandle}>Login</button>}
  </div>
  </>
  );
}

export default App;
