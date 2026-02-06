
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SearchOverlay = ({ isOpen, onClose, onSearch, initialQuery }) => {
    const [query, setQuery] = useState(initialQuery || '');

    useEffect(() => {
        if (isOpen) {
            // Simple focus logic could go here
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(query);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-50 bg-white/60 backdrop-blur-xl flex flex-col pt-24 px-6"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-6 right-6 p-2 bg-gray-100/50 rounded-full hover:bg-gray-200/50"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>

                    <h2 className="text-3xl font-black text-gray-800 mb-8 text-center">
                        무엇을<br />찾고 계신가요?
                    </h2>

                    <form onSubmit={handleSubmit} className="relative w-full shadow-2xl rounded-2xl">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="장소, 역, 메뉴 검색..."
                            className="w-full bg-white/80 p-6 text-xl font-bold rounded-2xl border-none outline-none placeholder-gray-400 focus:ring-4 focus:ring-blue-200"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-3 rounded-xl shadow-lg"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </button>
                    </form>

                    <div className="mt-8">
                        <p className="text-sm text-gray-500 font-bold mb-4">추천 키워드</p>
                        <div className="flex flex-wrap gap-2">
                            {['강남역', '스타벅스', '약국', '편의점', '주차장'].map(tag => (
                                <button
                                    key={tag}
                                    onClick={() => { setQuery(tag); onSearch(tag); onClose(); }}
                                    className="px-4 py-2 bg-white/50 border border-gray-200 rounded-lg text-sm font-medium hover:bg-white hover:border-blue-300 transition-all"
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SearchOverlay;
