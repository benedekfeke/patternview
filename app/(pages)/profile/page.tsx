'use client';

import TextBox from "@/app/components/TextBox";
import { useUser } from "@auth0/nextjs-auth0";
import { Calendar, Lock, Mail, User } from "lucide-react";
import { useEffect, useState } from "react";
import { Tooltip } from "react-tooltip";

export default function Profile() {
  const { user, isLoading } = useUser();
  const [userData, setUserData] = useState<{ username?: string; age?: string } | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchUser = async () => { 
      if (!user) {
        setIsLoadingData(false);
        return;
      }
      try {
        const response = await fetch('/api/users', {
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

      } catch (e) {
        console.error("failed to fetch get user:", e);
        setUserData({
          username: '',
          age: ''
        });
      } finally {
        setIsLoadingData(false);
      }
    };
    if (!isLoading) {
      fetchUser();
    }
  }, [user, isLoading]);

  const handleUpdateField = async (field: string, value: string) => {
    try {
      // no need for dynamic routing when the adapter handles by auth0 session.
      const response = await fetch(`/api/users`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({field, value})
      });

      if (!response.ok) {
        throw new Error('Failed to update');
      }

      setUserData(prev => ({
        ...prev,
        [field]: value
      }));

    } catch (error) {
      console.error("could not update user data:", error);
      throw error;
    }
  }

  if (isLoading || isLoadingData) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-8 text-white">
            <div className="animate-pulse">Loading user profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <div className="relative z-10 flex justify-center items-center min-h-screen">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg p-8 text-center">
            <p className="text-gray-200 mb-4">You are not logged in.</p>
            <a 
              href="/api/auth/login"
              className="inline-flex items-center justify-center rounded-md bg-purple-500 px-6 py-2 text-sm font-medium text-white hover:bg-purple-600 transition-colors"
            >
              Log in to view your profile
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* Main Content */}
      <div className="relative flex justify-center items-center min-h-screen p-4 pointer-events-auto">
        <div className="w-full max-w-lg">
          {/* Profile Card */}
          <div className="bg-white/10 backdrop-blur-xl border border-black rounded-4xl overflow-hidden shadow-2xl">
            {/* Header with Avatar */}
            <div className="relative h-32 bg-gradient-to-b from-black/50 to-white border-b border-black">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 shadow-2xl shadow-black rounded-full">
                {user.picture ? (
                  <img
                    className="w-24 h-24 rounded-full border-2 border-black object-cover shadow-lg"
                    src={user.picture}
                    alt={userData?.username || user.name || 'User profile'}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full border-4 border-black bg-purple-500/50 flex items-center justify-center">
                    <User size={40} className="text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="pt-16 pb-6 px-6">
              <h1 className="text-2xl font-bold text-center text-white mb-1">
                {userData?.username?.trim() ? userData?.username : user.name}
              </h1>
              <p className="text-gray-400 text-center text-sm mb-6">{user.email}</p>

              {/* Fields */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail size={18} className="text-purple-400 shrink-0 mt-3" />
                  <TextBox label="Email" content={user.email} editable={false}/>
                </div>
                
                <div className="flex items-start gap-3">
                  <Lock size={18} className="text-purple-400 shrink-0 mt-3" />
                  <TextBox label="Password" content="********" editable={false}/>
                </div>
                
                <div className="flex items-start gap-3">
                  <User size={18} className="text-purple-400 shrink-0 mt-3" />
                  <TextBox 
                    label="Username" 
                    content={userData?.username?.trim() ? userData?.username : user.name} 
                    editable={true}
                    onSave={(value) => handleUpdateField('username', value)}
                  />
                </div>
                
                <div className="flex items-start gap-3">
                  <Calendar size={18} className="text-purple-400 shrink-0 mt-3" />
                  <div className='w-full' 
                  data-tooltip-id='age-tooltip'
                  data-tooltip-content="Your age is used for analytical purposes only" data-tooltip-place='top'>
                    <TextBox
                      label="Age"
                      content={userData?.age || ''}
                      editable={true}
                      onSave={(value) => handleUpdateField('age', value)}
                    />
                  </div>
                  <Tooltip id='age-tooltip'/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
