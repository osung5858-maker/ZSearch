import React, { useState } from 'react';

function App() {
  const [searchTerm, setSearchTerm] = useState('');

  const quickTags = ['방송 장소', '예방접종', '주말 나들이', '맛집', '데이트 코스'];

  return (
    <div className="min-h-screen bg-white">
      {/* Header/Nav (Optional, keeping it simple for now) */}

      {/* Main Search Area */}
      <main className="flex flex-col items-center justify-center pt-20 pb-10 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tighter">
            ZSearch
          </h1>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-2xl relative mb-8">
          <div className="relative">
            <input
              type="text"
              className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full shadow-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 pl-14"
              placeholder="검색어를 입력하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Search Icon */}
            <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {/* Mic Icon (Optional mock) */}
            <div className="absolute right-5 top-1/2 transform -translate-y-1/2 text-blue-500 cursor-pointer hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Tags */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {quickTags.map((tag, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors duration-200"
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Result Cards Samples */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Broadcast Info Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
            <div className="h-48 bg-gradient-to-r from-pink-500 to-orange-400 relative">
              <div className="absolute bottom-4 left-4 text-white font-bold text-xl">생생정보통 맛집</div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-2">
                <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide mr-2">방송 출연</span>
                <span className="text-gray-500 text-sm">2023.10.25 방영</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">서울 마포구 연남동 파스타 맛집</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                방송에서 극찬한 바로 그 파스타! 신선한 재료와 쉐프만의 특별한 레시피로 만든...
              </p>
              <div className="flex items-center text-blue-600 hover:underline cursor-pointer font-medium">
                자세히 보기 &rarr;
              </div>
            </div>
          </div>

          {/* Hospital Info Card */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 border border-gray-100">
            <div className="h-48 bg-gradient-to-r from-cyan-500 to-blue-500 relative">
              <div className="absolute bottom-4 left-4 text-white font-bold text-xl">24시 열린 병원</div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-2">
                <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide mr-2">진료중</span>
                <span className="text-gray-500 text-sm">0.8km</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">튼튼 소아청소년과 의원</h3>
              <p className="text-gray-600 mb-4 line-clamp-2">
                야간 진료 가능, 주말/공휴일 진료. 영유아 검진 및 예방접종 전문 의료기관.
              </p>
              <div className="flex justify-between items-center">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-bold">
                  예약하기
                </button>
                <div className="flex items-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  02-1234-5678
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
