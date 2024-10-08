// Unauthorized.tsx
import React from 'react';

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-6">Unauthorized</h2>
        <p>You do not have permission to view this page.</p>
      </div>
    </div>
  );
}

export default Unauthorized;
