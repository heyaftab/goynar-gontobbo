<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_register(): void
    {
        $response = $this->postJson('/api/v1/auth/register', [
            'name' => 'Sara Khan',
            'email' => 'sara@example.com',
            'password' => 'secret123',
            'phone' => '+8801700000000',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'user' => ['id', 'name', 'email', 'phone', 'role'],
                'token',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'sara@example.com',
            'name' => 'Sara Khan',
        ]);
    }

    public function test_user_can_login(): void
    {
        $user = User::create([
            'name' => 'Aftab Ahmed',
            'email' => 'aftab@example.com',
            'password' => bcrypt('password123'),
        ]);

        $response = $this->postJson('/api/v1/auth/login', [
            'email' => 'aftab@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['user', 'token']);
    }

    public function test_user_can_sign_in_with_google(): void
    {
        $response = $this->postJson('/api/v1/auth/google', [
            'name' => 'Google User',
            'email' => 'google.user@example.com',
            'google_id' => 'google-sub-12345',
            'avatar' => 'https://example.com/avatar.jpg',
        ]);

        $response->assertStatus(200)
            ->assertJsonStructure(['user', 'token']);

        $this->assertDatabaseHas('users', [
            'email' => 'google.user@example.com',
            'google_id' => 'google-sub-12345',
        ]);
    }

    public function test_authenticated_user_can_update_profile(): void
    {
        $user = User::create([
            'name' => 'Initial Name',
            'email' => 'user@example.com',
            'password' => bcrypt('password'),
        ]);

        $token = $user->createToken();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->putJson('/api/v1/auth/profile', [
                'name' => 'Updated Name',
                'phone' => '+8801811111111',
                'address' => 'Dhaka, Bangladesh',
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('user.name', 'Updated Name')
            ->assertJsonPath('user.address', 'Dhaka, Bangladesh');

        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'address' => 'Dhaka, Bangladesh',
        ]);
    }

    public function test_user_can_logout(): void
    {
        $user = User::create([
            'name' => 'Logout User',
            'email' => 'logout@example.com',
            'password' => bcrypt('password'),
        ]);

        $token = $user->createToken();

        $response = $this->withHeader('Authorization', 'Bearer '.$token)
            ->postJson('/api/v1/auth/logout');

        $response->assertStatus(200);

        $this->assertDatabaseMissing('personal_access_tokens', [
            'token' => hash('sha256', $token),
        ]);
    }
}
