import { useState,useEffect } from 'react'
//import 'bootstrap/dist/css/bootstrap.min.css';
import TasksEl from './Components/Tasks';
import './App.css';
import {v4 as uuid} from 'uuid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
};

function App() {
  const[userInput,setUserInput]=useState('');
  const[incompleteTasks,setInCompleteTasks]=useState([]);
  const[completedTasks,setCompletedTasks]=useState([]);
  const[allTasksArray,setAllTasksArray]=useState([]);
  const[editText,setEditText]=useState('');
  const [open, setOpen] = useState(false);
  const[editTaskId,setEditTaskId]=useState('');
  const handleOpen = (recieveId) => {
    setEditTaskId(recieveId);
     let editTask=null;
     for(let eachItem of incompleteTasks){
      if(eachItem.id===recieveId){
        editTask=eachItem;
      }
     }
     setEditText(editTask.text);
     setOpen(true)
  };
  const handleClose = () => {
    const newInCompleteTasks=incompleteTasks.map((eachItem)=>{
      if(eachItem.id===editTaskId){
        return {...eachItem,text:editText}
      }
      else{
        return {...eachItem}
      }
    });
    const newAllTasksArray=[...newInCompleteTasks,...completedTasks];
    setInCompleteTasks(newInCompleteTasks);
    setAllTasksArray(newAllTasksArray);
    localStorage.clear();
    localStorage.setItem('taskList',JSON.stringify(newAllTasksArray));
    setOpen(false)
  };
  

  useEffect(()=>{
    const locallyStoredTasks=localStorage.getItem('taskList');
    const parsedList=JSON.parse(locallyStoredTasks);
    if(parsedList.length!=0){
      const filteredCompletedTasks=parsedList.filter((eachItem)=>(eachItem.status==="Completed"));
      const filteredInCompleteTasks=parsedList.filter((eachItem)=>(eachItem.status==="InComplete"))
      setCompletedTasks(filteredCompletedTasks);
      setInCompleteTasks(filteredInCompleteTasks);
      setAllTasksArray([...filteredCompletedTasks,...filteredInCompleteTasks]);
    }

  },[])
  const addingTask=()=>{
     if(userInput!=""){
      const task={
        id:uuid(),
        status:"InComplete",
        text:userInput
      }
      const newIncompleteTasks = [...incompleteTasks, task];
    const newAllTasksArray = [...completedTasks, ...newIncompleteTasks];

    setInCompleteTasks(newIncompleteTasks);
    setAllTasksArray(newAllTasksArray);
    setUserInput("");
    localStorage.clear();
    localStorage.setItem("taskList", JSON.stringify(newAllTasksArray));
     }
     else{
      alert("Enter Text in the Input")
     }
  }
  const updateTaskStatus=(recieveId)=>{
    let singleTaskUpdate=null;
    for(let eachItem of incompleteTasks){
      if(eachItem.id===recieveId){
        singleTaskUpdate=eachItem;
      }
    }
    if(singleTaskUpdate!=null){
      singleTaskUpdate.status="Completed";
    }
    const newInCompletedTasks=incompleteTasks.filter((eachItem)=>(eachItem.id!=recieveId));
    const newCompletedTasks=[...completedTasks,singleTaskUpdate]
    setInCompleteTasks(newInCompletedTasks)
    setCompletedTasks(newCompletedTasks)
    setAllTasksArray([...newCompletedTasks,...newInCompletedTasks])
    localStorage.clear();
    localStorage.setItem('taskList',JSON.stringify(allTasksArray))
  }
  const deleteTasks=(recieveId)=>{
    const updatedInCompleteTasks=incompleteTasks.filter((eachItem)=>(eachItem.id!=recieveId));
    const updatedCompletedTasks=completedTasks.filter((eachItem)=>(eachItem.id!=recieveId));
    const newAllTasksArray=[...updatedCompletedTasks,...updatedInCompleteTasks]
    setInCompleteTasks(updatedInCompleteTasks)
    setCompletedTasks(updatedCompletedTasks);
    setAllTasksArray(newAllTasksArray)
    console.log(newAllTasksArray);
    localStorage.clear();
    localStorage.setItem('taskList',JSON.stringify(newAllTasksArray))
  }
  return (
    <>
     <div style={{minHeight:"100vh",backgroundColor:"blueviolet",paddingBottom:'30px'}}>
     <div className='main-container'>
      <input type="text" className='input-field-styling' 
        value={userInput} placeholder='Enter Your Task'
       onChange={(event)=>(setUserInput(event.target.value))}/>
       <br/>
       <button type='button'onClick={addingTask} className='add-button-styling'>Add</button>
       </div>
       <div style={{minHeight:"400px"}}>
       <h1 className='incomplete-heading-styling'>InComplete Tasks:</h1>
       {incompleteTasks.length!==0?incompleteTasks.map((eachItem)=>(<TasksEl key={eachItem.id} data={eachItem} markAsRead={updateTaskStatus} deleteTask={deleteTasks} edit={handleOpen}/>)) :
       <div className='text-center'>
        <img src="/notfound.png" className='image-styling' alt='not-found'/>
        <h1 className='not-found-heading-styling'>No Incomplete Tasks</h1>
       </div>}
       </div>
       <h1 className='incomplete-heading-styling'>Completed Tasks:</h1>
       {completedTasks.length!=0?completedTasks.map((eachItem)=>(<TasksEl key={eachItem.id} data={eachItem} deleteTask={deleteTasks}/>)):
        <div className='text-center'>
        <img src="/notfound.png" className='image-styling' alt='not-found'/>
        <h1 className='not-found-heading-styling'>No completed Tasks</h1>
       </div>}
       { <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <input type='text' 
           className='edit-input-styling'
           value={editText} 
           onChange={(event)=>(setEditText(event.target.value))} 
           placeholder='Enter Your Text'/>
          <br/>
          <button className='btn btn-primary mt-4' onClick={handleClose}>Save</button>
        </Box>
      </Modal>
       }
     </div>
      
    </>
  )
}

export default App
