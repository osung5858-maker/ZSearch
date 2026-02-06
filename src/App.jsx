import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabaseClient';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [sortByDistance, setSortByDistance] = useState(false);

  const quickTags = ['관공서', '학교', '병원', '약국', '지하철', '명소', '안전', '생활', '강남구'];

  const tagMapping = {
    '관공서': 'GOV',
    '학교': 'SCH',
    '병원': 'HOSP',
    '약국': 'PHARM',
    '지하철': 'TRANS',
    '명소': 'LANDMARK',
    '안전': 'SAFETY',
    '생활': 'LIFE',
    '강남구': '강남구'
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Haversine formula to calculate distance in km
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 9999;

    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("이 브라우저에서는 위치 기반 서비스를 지원하지 않습니다.");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setSortByDistance(true);
        setLoading(false);
        // Re-sort existing services or fetch new
        if (services.length > 0) {
          const sorted = [...services].sort((a, b) => {
            const distA = calculateDistance(latitude, longitude, a.lat, a.lng);
            const distB = calculateDistance(latitude, longitude, b.lat, b.lng);
            return distA - distB;
          });
          setServices(sorted);
        } else {
          fetchServices('', { lat: latitude, lng: longitude });
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setLoading(false);
        alert("위치 정보를 가져올 수 없습니다. 권한을 확인해주세요.");
      }
    );
  };

  const fetchServices = async (query = '', location = null) => {
    setLoading(true);
    setError(null);
    try {
      let queryBuilder = supabase
        .from('public_services')
        .select('*')
        .limit(50);

      if (query) {
        const typeCode = tagMapping[query] || query.toUpperCase();
        if (['GOV', 'SCH', 'HOSP', 'PHARM', 'SAFETY', 'LIFE', 'TRANS', 'LANDMARK'].includes(typeCode)) {
          queryBuilder = queryBuilder.eq('type', typeCode);
        } else {
          queryBuilder = queryBuilder.or(`name.ilike.%${query}%,address.ilike.%${query}%`);
        }
      }

      const { data, error } = await queryBuilder;

      if (error) throw error;

      let resultData = data || [];

      // If location is provided or userLocation exists, calculate distance
      const loc = location || userLocation;
      if (loc) {
        resultData = resultData.map(item => ({
          ...item,
          distance: calculateDistance(loc.lat, loc.lng, item.lat, item.lng)
        })).sort((a, b) => a.distance - b.distance);
      }

      setServices(resultData);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchServices(searchTerm);
  };

  const handleTagClick = (tag) => {
    setSearchTerm(tag);
    fetchServices(tag);
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'HOSP': return <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide mr-2">병원</span>;
      case 'GOV': return <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide mr-2">관공서</span>;
      case 'SCH': return <span className="bg-green-100 text-green-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide mr-2">학교</span>;
      case 'PHARM': return <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide mr-2">약국</span>;
      case 'SAFETY': return <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide mr-2">안전</span>;
      case 'LIFE': return <span className="bg-purple-100 text-purple-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide mr-2">생활</span>;
      case 'TRANS': return <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide mr-2">교통</span>;
      case 'LANDMARK': return <span className="bg-teal-100 text-teal-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide mr-2">명소</span>;
      default: return <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide mr-2">{type}</span>;
    }
  };

  const getGradient = (type) => {
    switch (type) {
      case 'HOSP': return 'from-red-400 to-pink-500';
      case 'GOV': return 'from-blue-400 to-cyan-500';
      case 'SCH': return 'from-green-400 to-emerald-500';
      case 'PHARM': return 'from-yellow-400 to-orange-500';
      case 'SAFETY': return 'from-orange-400 to-red-500';
      case 'LIFE': return 'from-purple-400 to-indigo-500';
      case 'TRANS': return 'from-indigo-400 to-blue-500';
      case 'LANDMARK': return 'from-teal-400 to-green-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <main className="flex flex-col items-center pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 animate-fade-in-down">
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tighter cursor-pointer" onClick={() => { setSearchTerm(''); fetchServices(''); }}>
            ZSearch
          </h1>
        </div>

        <form onSubmit={handleSearch} className="w-full max-w-2xl relative mb-6 z-10">
          <div className="relative group flex gap-2">
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full px-6 py-4 text-lg border-2 border-gray-200 rounded-full shadow-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 pl-14 group-hover:shadow-xl"
                placeholder="장소, 주소, 또는 종류를 검색해보세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGeolocation}
              className="bg-white border-2 border-gray-200 text-gray-600 p-4 rounded-full hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all duration-200 shadow-md group-hover:shadow-lg flex-shrink-0"
              title="내 주변 탐색"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </form>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {quickTags.map((tag, index) => (
            <button
              key={index}
              onClick={() => handleTagClick(tag)}
              className="px-4 py-2 bg-white border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-full text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            >
              #{tag}
            </button>
          ))}
        </div>

        <div className="w-full max-w-6xl">
          <h2 className="text-xl font-bold text-gray-800 mb-6 px-2 flex items-center justify-between">
            <div className="flex items-center">
              {loading ? '검색 중...' : services.length > 0 ? `검색 결과 (${services.length})` : '검색 결과가 없습니다.'}
              {searchTerm && !loading && <span className="ml-2 text-sm font-normal text-gray-500">'{searchTerm}'에 대한 결과</span>}
            </div>
            {userLocation && <span className="text-sm text-blue-600 font-medium">📍 내 위치 기준 정렬됨</span>}
          </h2>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && services.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100 flex flex-col h-full">
                  <div className={`h-24 bg-gradient-to-r ${getGradient(service.type)} relative flex items-end p-4`}>
                    <div className="text-white font-bold text-2xl shadow-sm drop-shadow-md truncate w-full">{service.name}</div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        {getTypeBadge(service.type)}
                        {service.distance !== undefined && (
                          <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {service.distance.toFixed(1)}km
                          </span>
                        )}
                      </div>

                      <div className="flex items-start mb-2 text-gray-600 text-sm">
                        <svg className="w-5 h-5 mr-2 text-gray-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span className="leading-snug">{service.address}</span>
                      </div>

                      {service.phone && (
                        <div className="flex items-center mb-4 text-gray-600 text-sm">
                          <svg className="w-5 h-5 mr-2 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                          {service.phone}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                      <button className="text-gray-500 hover:text-blue-600 text-sm font-medium flex items-center transition-colors">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        상세정보
                      </button>
                      <a
                        href={`https://map.naver.com/v5/search/${encodeURIComponent(service.name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-bold flex items-center"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                        길찾기
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && services.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="text-6xl mb-4">😿</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">찾으시는 정보가 없어요</h3>
              <p className="text-gray-500 mb-6">다른 키워드로 검색하거나 태그를 눌러보세요!</p>
              <button onClick={() => { setSearchTerm(''); fetchServices(''); }} className="text-blue-600 font-bold hover:underline">
                전체 목록 보기
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
