<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use App\Models\User;

class TaskController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index(Request $request)
    {
        $user = auth()->user()->load('role');

        $admin = $user->role ? $user->role->id == 1 : null;

        $query = Task::query();

        // Search
        if (!empty($request->search)) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function ($query) use ($searchTerm) {
                $query->where('title', 'like', $searchTerm)
                    ->orWhere('description', 'like', $searchTerm);
            });
        }

        // Filter By Status
        if (!empty($request->status) && $request->status != 'all') {
            $query->where('status', $request->status);
        }

        if($admin){
            $tasks = $query->with('user')->paginate(10);
        }else{
            $tasks = $query->where('user_id', auth()->id())->paginate(10);
        }
        // dd($tasks->user->name);
        $users = User::where('role_id','!=','1')->get();

        return response()->json([
            'tasks' => $tasks,
            'is_admin' => $admin,
            'users' => $users
        ]);
    }

    public function store(Request $request)
    {
        $rules = [
            'title' => 'required|string|min:3',
            'description' => 'required|string|min:3',
            'due_date' => 'required|date|after_or_equal:today',
            'user_id' => 'required',
        ];

        $validator = \Validator::make($request->all(), $rules);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
        $task = Task::create($request->all() + ['status' => 'pending']);

        return response()->json($task, 201);
    }


    public function update(Request $request, Task $task)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|min:3',
            'description' => 'required|string|min:3',
            'due_date' => 'required|date|after_or_equal:today',
            'status' => 'required|in:pending,completed',
        ]);

        $task->update($validatedData);

        return response()->json($task);
    }


    public function destroy(Task $task)
    {
        $task->delete();
        return response()->json(null, 204);
    }
}
