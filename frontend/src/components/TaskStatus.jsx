import { useEffect, useState } from 'react';
import axios from 'axios';

export default function TaskStatus({ taskId, onStatusChange, onComplete }) {
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/tasks/${taskId}`);
        setStatus(res.data.status);
        onStatusChange(res.data.status);

        if (res.data.status === 'completed') {
          clearInterval(interval);

          const result = await axios.get(`http://127.0.0.1:8000/tasks/${taskId}/data`);
          onComplete(result.data);
        }
      } catch (err) {
        console.error('Error checking task status:', err);
        clearInterval(interval);
      }
    }, 2000); // poll every 2 seconds

    return () => clearInterval(interval); // cleanup
  }, [taskId]);

  return (
    <p className="mt-4 text-yellow-400 font-medium">
      ⏳ Task Status: {status}
    </p>
  );
}
