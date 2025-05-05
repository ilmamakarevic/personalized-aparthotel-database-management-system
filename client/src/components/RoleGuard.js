import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleGuard = ({ children, allowed }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  console.log("RoleGuard – User:", user);
  console.log("Allowed roles:", allowed);
  console.log("User role:", user?.role);
  console.log("Includes check:", allowed.includes(user?.role));

  if (!user || !allowed.includes(user.role)) {
    return <div>Access denied: role not permitted</div>;
  }

  return children;
};

export default RoleGuard;
