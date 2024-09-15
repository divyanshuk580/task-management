<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\Task;
use Livewire\WithPagination;

class TaskStatus extends Component
{
    use WithPagination;

    public $statusFilter = 'all';
    public $search = '';

    protected $updatesQueryString = [
        'statusFilter' => ['except' => 'all'],
        'search' => ['except' => '']
    ];

    public function searchTasks($search)
    {
        $this->search = $search;
        $this->resetPage();
    }

    public function updateStatus($taskId, $status)
    {
        $task = Task::find($taskId);
        if ($task) {
            $task->status = $status;
            $task->save();

            session()->flash('message', 'Task status updated successfully.');
        }
    }

    public function filterTasks($filter)
    {
        $this->statusFilter = $filter;
        $this->resetPage();
    }

    public function render()
    {
        $query = Task::query();

        if ($this->statusFilter != 'all') {
            $query->where('status', $this->statusFilter);
        }

        if ($this->search) {
            $query->where(function($q) {
                $q->where('title', 'like', '%' . $this->search . '%')
                  ->orWhere('description', 'like', '%' . $this->search . '%');
            });
        }

        if (auth()->user()->role->id != 1) {
            $query->where('user_id', auth()->id());
        }

        $tasks = $query->paginate(10);

        return view('livewire.task-status', ['tasks' => $tasks]);
    }
}
