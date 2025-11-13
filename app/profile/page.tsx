'use client';

import { useUser } from "@auth0/nextjs-auth0";

export default function Profile() {
  const { user, isLoading } = useUser();

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
    <div className="profile-card action-card">
      {user.picture && (
        <img
          src={user.picture}
          alt={user.name || 'User profile'}
          className="profile-picture"
        />
      )}
      <h2 className="profile-name">{user.name}</h2>
      <p className="profile-email">{user.email}</p>
    </div>
  );
}
