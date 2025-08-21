import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

export type Todo = {
  id: number
  title: string
  description: string
  createdAt: string
  completed: boolean
}

const api = axios.create({
  baseURL:  'http://localhost:9008/api/v1',
})

export function App() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [id,setId]=useState<number |null>(null);

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const remainingCount = useMemo(() => todos.filter(t => !t.completed).length, [todos])

  useEffect(() => {
    let ignore = false
    setLoading(true)
    api.get<Todo[]>('/task')
      .then(res => { if (!ignore) setTodos(res.data) })
      .catch(err => { if (!ignore) setError(err?.response?.data?.message ?? 'Failed to load todos') })
      .finally(() => { if (!ignore) setLoading(false) })
    return () => { ignore = true }
  }, [])

  function resetForm() {
    setTitle('')
    setDescription('')
  }

  async function handleCreateTodo(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    try {
      const payload = { title: title.trim(), description: description.trim() }
      const res = await api.post<Todo>('/task', payload)
      setTodos(prev => [res.data, ...prev])
      resetForm()
      getAllTasks()
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to create todo')
    }
  }

  async function getAllTasks() {
  try {
    const res = await api.get<Todo[]>('/task')
    setTodos(res.data);
  } catch (err: any) {
    setError(err?.response?.data?.message ?? 'Failed to update todo')
  }
}

  async function updateStatus(id: Number) {
    try {
      console.log(id);
      await api.put(`/task/${id}`)
      getAllTasks();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? 'Failed to delete todo')
    }
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg"></div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">Elegant Tasks</h1>
          </div>
          <div className="text-sm text-slate-500">{remainingCount} remaining</div>
        </header>

        <main className="grid md:grid-cols-2 gap-6">
          <section className="glass-card rounded-2xl p-5 animate-fadeIn">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Create a task</h2>
            <form onSubmit={handleCreateTodo} className="space-y-4">
              <div>
                <label className="label">Title</label>
                <input
                  className="input mt-1"
                  placeholder="e.g. Prepare meeting agenda"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea
                  className="input mt-1 min-h-[100px] resize-y"
                  placeholder="Add helpful context..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>
              {error && (
                <div className="rounded-md bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>
              )}
              <div className="flex gap-3">
                <button type="submit" className="btn-primary">Add Task</button>
                <button type="button" className="btn-secondary" onClick={resetForm}>Reset</button>
              </div>
            </form>
          </section>

          <section className="glass-card rounded-2xl p-5 animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-slate-800">Your tasks</h2>
              {loading && <span className="text-sm text-slate-500">Loading…</span>}
            </div>
            <ul className="divide-y divide-slate-100">
              {todos.length === 0 && !loading && (
                <li className="py-6 text-center text-slate-500">No tasks yet. Add your first one!</li>
              )}
              {todos.map(todo => (
                <li key={todo.id} className="py-4 flex items-start gap-3">
                  <div className='flex justify-between item-center w-full'>
                    <div>
                        <h3 className={`font-medium ${todo.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>{todo.title}</h3>
                        {todo.description && (
                          <p className={`mt-1 text-sm ${todo.completed ? 'text-slate-400' : 'text-slate-600'}`}>{todo.description}</p>
                        )}
                    </div>
                    <div> <button onClick={() => updateStatus(todo.id)} className="text-slate-400 hover:bg-blue-600 transition bg-blue-500 rounded-md p-2 px-6 text-sm text-white" aria-label="Delete">
                        Done
                      </button></div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </main>
      </div>
    </div>
  )
}


