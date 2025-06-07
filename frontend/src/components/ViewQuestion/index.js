import React from 'react';
import Sidebar from '../Main/Sidebar';
import MainQuestion from './MainQuestion';

function Index() {
  return (
    <div className="flex h-[91vh] text-white">
      {/* Sidebar (fixed width) */}
      <div className="w-64">
        <Sidebar />
      </div>

      {/* Main content (flex grows) */}
      <div className="flex-1 p-6 overflow-y-auto">
        <MainQuestion />
      </div>
    </div>
  );
}

export default Index;
