<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Task;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Task::create([
            'title' => 'Sample Task 1',
            'description' => 'This is a sample task description.',
            'status' => 'pending',
            'due_date' => Carbon::now()->addDays(5),
            'user_id' => 2,
        ]);

        Task::create([
            'title' => 'Sample Task 2',
            'description' => 'This is another sample task description.',
            'status' => 'completed',
            'due_date' => Carbon::now()->addDays(10),
            'user_id' => 2,
        ]);

        Task::create([
            'title' => 'Sample Task 3',
            'description' => 'This is another sample task description.',
            'status' => 'completed',
            'due_date' => Carbon::now()->addDays(10),
            'user_id' => 2,
        ]);

        Task::create([
            'title' => 'Sample Task 4',
            'description' => 'This is another sample task description.',
            'status' => 'completed',
            'due_date' => Carbon::now()->addDays(10),
            'user_id' => 2,
        ]);
    }
}
