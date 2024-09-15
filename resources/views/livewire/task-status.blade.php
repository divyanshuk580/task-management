<div>
    @if (session('message'))
        <div class="alert alert-success">{{ session('message') }}</div>
    @endif
    <div class="row mb-2">
        <div class="col-md-3">
            <label for="statusFilter"><b>Filter by Status:</b></label>
            <select id="statusFilter" wire:change="filterTasks($event.target.value)" class="form-control">
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
            </select>
        </div>

        <div class="col-md-6">
            <label for="search"><b>Search:</b></label>
            <input type="text" id="search" wire:input="searchTasks($event.target.value)"
                placeholder="Search tasks by title or description..." class="form-control">
        </div>
        <div class="col-md-3">
            <a href="{{ route('dashboard') }}" class="btn btn-success mt-4" style="float: right;">Back to Dashboard</a>
        </div>
    </div>


    <table class="table">
        <thead>
            <tr>
                <th>Title</th>
                <th>Description</th>
                <th>Status</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($tasks as $task)
                <tr>
                    <td>{{ $task->title }}</td>
                    <td>{{ $task->description }}</td>
                    <td>{{ $task->status }}</td>
                    <td>
                        <select wire:change="updateStatus({{ $task->id }}, $event.target.value)"
                            class="form-control">
                            <option value="pending" {{ $task->status == 'pending' ? 'selected' : '' }}>Pending</option>
                            <option value="completed" {{ $task->status == 'completed' ? 'selected' : '' }}>Completed
                            </option>
                        </select>
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="d-flex justify-content-center">
        {{ $tasks->links('pagination::bootstrap-4') }}
    </div>
</div>
