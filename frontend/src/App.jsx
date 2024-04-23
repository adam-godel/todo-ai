import './App.css'
import Navbar from './components/navbar/navbar'
import Footer from './components/footer/footer'
import Info from './components/info/info'
import { FaTasks, FaPlus } from 'react-icons/fa'
import Task from './components/task/task'
import { useEffect, useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([])
  const [taskInput, setTaskInput] = useState("")

  function addTask() {
    if (taskInput == "") return
    fetch('http://localhost:3000/add-todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: taskInput })
    }).then(res => console.log(res))
    setTasks([...tasks, taskInput])
    setTaskInput("")
  }

  function delTask(index) {
    let newTasks = [...tasks]
    newTasks.splice(index, 1)
    fetch('http://localhost:3000/delete-todo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: tasks[index] })
    }).then(res => console.log(res))
    setTasks(newTasks)
  }

  useEffect(() => {
    fetch('http://localhost:3000/todos')
      .then(res => res.json())
      .then(data => {
        console.log(data)
        let newTasks = []
        for (let i = 0; i < data.length; i++) {
          newTasks.push(data[i].name)
        }
        setTasks(newTasks)
      })
  }, [])

  return (
    <>
      <Navbar />
      <div className='seperator'></div>
      <Info />
      <main className='main'>
        <section className='todo'>
          <div className='todo-input'>
            <FaTasks color='#fff' size='1em'/>
            <input value={taskInput} onChange={(e) => setTaskInput(e.target.value)} type="text" placeholder="add a task"/>
            <div className='add'>
              <FaPlus color='#fff' size='1em' onClick={addTask}/>
            </div>
          </div>
          {
            tasks.map((task, index) => (
                <Task key={index} name={task} index={index} deletefxn={delTask}/>
            ))
          }
        </section>
      </main>
      <Footer />
    </>
  )
}

export default App
