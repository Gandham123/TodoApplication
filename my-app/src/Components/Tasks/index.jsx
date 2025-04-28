import './index.css';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
const TasksEl=(props)=>{
    const{data,markAsRead,deleteTask,edit}=props
    const{id,status,text}=data
    const statusUpdateHandel=()=>{
         markAsRead(id)
    }
    const deletingTasksHandle=()=>{
        deleteTask(id);
    }
    const editingHandle=()=>{
        edit(id);
    }
    return(
        <>
        <div className='tasks-main-container'>
           <input type='checkbox' 
            onClick={statusUpdateHandel} 
            className='input-checkbox-styling'
            checked={status==="Completed"?true:false}/>
          <div className='task-container'>
            <p className='task-text-styling'>
                {text}
            </p>
            <div>
            {status==="InComplete"?<FaEdit onClick={editingHandle} size={20} style={{marginRight:"15px",cursor:"pointer"}}/>:""}
            <MdDelete size={20} style={{cursor:"pointer"}} onClick={deletingTasksHandle}/>
            </div>
          </div>
        </div>
        </>
    )
}
export default TasksEl;