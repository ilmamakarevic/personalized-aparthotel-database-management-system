import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleRouter = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'owner':
      return <Navigate to="/dashboard/owner" />;
    case 'housekeeping':
      return <Navigate to="/dashboard/housekeeping" />;
    case 'front_office':
      return <Navigate to="/dashboard/front" />;
    case 'manager':
      return <Navigate to="/dashboard/manager" />;
    default:
      return <div>Unauthorized role</div>; 
  }
};

export default RoleRouter;
