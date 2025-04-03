// App.jsx — updated to include TaskStatus
import { useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskStatus from './components/TaskStatus';
import ChartDisplay from './components/ChartDisplay';

export default function App() {
  const [taskId, setTaskId] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [taskData, setTaskData] = useState([]);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Narravance Task Dashboard</h1>
      <TaskForm onTaskCreated={setTaskId} />
      {taskId && (
        <TaskStatus
          taskId={taskId}
          onStatusChange={setTaskStatus}
          onComplete={setTaskData}
        />
      )}
      {taskStatus === 'completed' && <ChartDisplay data={taskData} />}
    </div>
  );
}
