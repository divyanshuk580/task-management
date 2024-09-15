<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Role;
class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::create([
        	'name' => 'admin',
        	'role_order'=>10
        ]);

    	Role::create([
    		'name' => 'user',
    		'role_order'=>20
    	]);
    }
}
