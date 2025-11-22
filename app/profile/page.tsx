'use client';

import { useUser } from "@auth0/nextjs-auth0";
import { useEffect, useState } from "react";
import TextBox from "../components/TextBox";

export default function Profile() {
  const { user, isLoading } = useUser();
  const [userData, setUserData] = useState<{ username?: string; age?: string }>(() => ({
    username: user?.username ?? '',
    age: user?.age ? String(user.age) : ''
  }));

  useEffect(() => {
    const fetchUser = async () => { 
      try {
        const response = await fetch('/api/user/get_user', {
          method: 'GET',
          headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) {
          throw new Error('Failed to retrieve');
        }

        const data = await response.json();

        setUserData({
          username: data.user.username ?? '',
          age: data.user.age ? String(data.user.age) : ''
        });

        console.log(userData);

      } catch (e) {
        console.error("failed to fetch get user:", e);
      }
    };

    fetchUser();
  }, []); //run once on mount

  const handleUpdateField = async (field: string, value: string) => {
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({field, value})
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

    } catch (error) {
      console.error("could not update user data:", error);
      throw error; //Re-throw to handle in TextBox
    }
  }

  if (isLoading) {
    return (
      <div className="loading-state">
        <div className="loading-text">Loading user profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="no-user-state">
        <div className="no-user-text">You are not logged in. Please <a href="/api/auth/login">log in</a> to view your profile.</div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
    <div className="flex flex-col w-max rounded-lg overflow-hidden shadow-lg ">
      {user.picture && (
        <img
          className="w-full h-48 object-cover"
          src={user.picture}
          alt={userData.username || user.name || 'User profile'}
        />
      )}
      <div className="p-6 space-y-3">
        <TextBox label="Email" content={user.email} editable={false}/>
        <TextBox label="Password" content="********" editable={false}/>
        <TextBox label="Username" content={userData.username?.trim() ? userData.username : user.name} editable={true}
          onSave={(value) => handleUpdateField('username', value)}
        />
        <TextBox label="Age" content={userData.age} editable={true}
          onSave={(value) => handleUpdateField('age', value)} 
        />
      </div>
    </div>
    </div>
  );
}
