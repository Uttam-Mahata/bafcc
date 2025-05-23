import React from 'react';

const Header: React.FC = () => {
  return (
    <div className="bg-blue-800 text-white p-4 rounded-t-lg">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="bg-white rounded-full p-2 mr-4">
            <img 
              src="/football-logo.svg" 
              alt="BAFCC Logo" 
              className="h-16 w-16"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/64?text=BAFCC";
              }} 
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold">BANDHGORA ANCHAL</h1>
            <h2 className="text-xl md:text-3xl font-bold">FOOTBALL COACHING CAMP</h2>
          </div>
        </div>
        <div className="text-sm md:text-base">
          <p className="flex items-center mb-1">
            <span className="mr-2">📍</span> BANDHGORA, JHARGRAM,721514
          </p>
          <p className="flex items-center">
            <span className="mr-2">📧</span> bandhgoraanchalfc2025@gmail.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header; 