import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';

export type User = {
  // id: string;
  name: string;
  email: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  // register: (user: User, token: string) => void;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: (user, token) => {
        set({ user, token, isAuthenticated: true });
      },
      // register: (user, token) => {
      //   set({ user, token, isAuthenticated: true });
      // },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    { name: 'auth-storage' }
  )
);

// Mock authentication API functions for demonstration
// In a real app, these would make actual API calls
export async function loginUser(email: string, password: string): Promise<{ user: User; token: string }> {
  // Simulate API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Demo validation
      if (email === 'demo@example.com' && password === 'password') {
        resolve({
          user: {
            // id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
          },
          token: 'demo-jwt-token',
        });
      } else {
        reject(new Error('Invalid credentials'));
      }
    }, 800);
  });
}

// export async function registerUser(name: string, email: string, password: string): Promise<{ user: User; token: string }> {
//   // Simulate API call
//   return new Promise((resolve) => {
//     // setTimeout(() => {
//       const url = 'http://localhost:8081/api/v1/users/register';
//       // axios.post(url, )
//       const response = fetch(url, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ username: name, email, password }),
//       });
//       console.log(response)
//     //   resolve({
        
    
//     //     // user: {
//     //     //   id: '1',
//     //     //   name,
//     //     //   email,
//     //     // },
//     //     // token: 'demo-jwt-token',
//     //   });
//     // }, 800);
//     // console.log(response)
//     // alert(response)

//   });
// }

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<{ user: { name: string; email: string }; token: string }> {
  const url = "http://localhost:8081/api/v1/users/register";

  try {
    // Using `fetch` with proper await for async behavior
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: name, email, password }),
    });

    // Check if response is okay
    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    // Parse response body as JSON
    const data = await response.json();

    // Assuming response structure contains `user` and `token`
    return {
      user: {
        // id: data.user.id,
        name: data.user.name,
        email: data.user.email,
      },
      token: data.token || "data",
    };
  } catch (error) {
    console.error("Error registering user:", error);
    throw error; // Rethrow for error handling in the calling function
  }
}