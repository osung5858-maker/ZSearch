
import React, { useState } from 'react';

const FamilyProfile = ({ onRecommend }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [profile, setProfile] = useState({
        adults: 2,
        children: 1,
        hasPet: false
    });

    const handleRecommend = () => {
        // Simple Rule-based Logic
        let type = 'LANDMARK';
        let keyword = '';

        if (profile.hasPet) {
            keyword = 'Park';
            type = 'LANDMARK'; // Parks
        } else if (profile.children > 0) {
            keyword = 'Library'; // Educational or Fun
            type = 'LIFE';
        } else {
            keyword = 'Museum';
            type = 'LANDMARK';
        }

        // Pass back to parent to filter
        onRecommend(keyword, type);
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all z-40 transform hover:scale-110"
                title="Family Recommendations"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </button>

            {/* Drawer / Modal */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl transform transition-all">
                        <div className="bg-gradient-to-r from-pink-500 to-rose-500 p-6 text-white">
                            <h3 className="text-xl font-bold flex items-center justify-between">
                                👨‍👩‍👧‍👦 Family Profile
                                <button onClick={() => setIsOpen(false)} className="text-white hover:text-pink-100">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </h3>
                            <p className="text-pink-100 text-sm mt-1">Get personalized recommendations</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <label className="font-bold text-gray-700">Adults</label>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setProfile({ ...profile, adults: Math.max(1, profile.adults - 1) })} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">-</button>
                                    <span className="font-bold w-4 text-center">{profile.adults}</span>
                                    <button onClick={() => setProfile({ ...profile, adults: profile.adults + 1 })} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">+</button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <label className="font-bold text-gray-700">Children</label>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => setProfile({ ...profile, children: Math.max(0, profile.children - 1) })} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">-</button>
                                    <span className="font-bold w-4 text-center">{profile.children}</span>
                                    <button onClick={() => setProfile({ ...profile, children: profile.children + 1 })} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-600 hover:bg-gray-200">+</button>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                <label className="font-bold text-gray-700 flex items-center">
                                    <span className="mr-2">🐶</span> With Pet?
                                </label>
                                <input
                                    type="checkbox"
                                    checked={profile.hasPet}
                                    onChange={(e) => setProfile({ ...profile, hasPet: e.target.checked })}
                                    className="w-5 h-5 text-pink-500 rounded focus:ring-pink-500"
                                />
                            </div>

                            <button
                                onClick={handleRecommend}
                                className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                Get Recommendations
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FamilyProfile;
