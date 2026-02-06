
import React, { useState, useRef } from 'react';
import exifr from 'exifr';

const VisionSearch = ({ onSearch, onLocationFound }) => {
    const [image, setImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Preview
        const reader = new FileReader();
        reader.onload = (e) => setImage(e.target.result);
        reader.readAsDataURL(file);

        setAnalyzing(true);

        try {
            // 1. Extract GPS (Real Logic using exifr)
            const gps = await exifr.gps(file);
            if (gps) {
                console.log("📍 Exif GPS Found:", gps);
                if (onLocationFound) onLocationFound({ lat: gps.latitude, lng: gps.longitude });
            }

            // 2. Mock AI Analysis (Simulating GPT-4o Vision)
            // In a real app, we would send 'file' to a backend endpoint here.
            setTimeout(() => {
                const mockResult = {
                    name: "Starbucks Gangnam",
                    type: "COFFEE",
                    keywords: ["Coffee", "Cafe", "Gangnam"],
                    description: "Detected a Starbucks sign. Popular menu items: Americano, Latte."
                };

                onSearch(mockResult.keywords[0]);
                setAnalyzing(false);
            }, 2500);

        } catch (err) {
            console.error("Analysis failed", err);
            setAnalyzing(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-blue-100 mb-8 max-w-2xl w-full">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <span className="text-2xl mr-2">📸</span> AI Vision Search
            </h3>

            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div
                    onClick={() => {
                        if (navigator.vibrate) navigator.vibrate(10);
                        fileInputRef.current.click();
                    }}
                    className="w-full md:w-1/2 h-64 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors bg-gray-50 relative overflow-hidden"
                >
                    {image ? (
                        <img src={image} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                    ) : (
                        <>
                            <span className="text-sm text-gray-500 font-medium">📸 Tap to Scan (Camera)</span>
                        </>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        capture="environment"
                        onChange={handleImageUpload}
                    />
                </div>

                <div className="w-full md:w-1/2 relative">
                    {analyzing ? (
                        <div className="space-y-4">
                            <div className="flex items-center text-blue-600 font-bold animate-pulse">
                                <svg className="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                Analyzing Scene...
                            </div>
                            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 animate-progress" style={{ width: '60%' }}></div>
                            </div>
                            <p className="text-xs text-gray-500">Detecting objects, reading text, and extracting GPS coordinates...</p>
                        </div>
                    ) : image ? (
                    ): image && !analyzing ? (
                    <div className="absolute top-4 left-4 right-4 bg-yellow-100 p-4 rounded-lg shadow-xl rotate-1 border border-yellow-200 animate-fade-in-up">
                        <div className="text-gray-800 font-black mb-1 flex items-center justify-between">
                            <span className="text-lg">✨ Analysis Result</span>
                            <span className="text-xs bg-yellow-300 px-2 py-1 rounded">confidence: 98%</span>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">Starbucks Gangnam</h4>
                        <p className="text-sm text-gray-700 mb-3 font-medium">
                            "Identified as a coffee shop. Popular for Americano and Cold Brew."
                        </p>
                        <button className="w-full py-2 bg-gray-900 text-white rounded-lg font-bold text-sm shadow-md">
                            View Details & Menu
                        </button>
                    </div>
                    ) : (
                    <div className="text-gray-400 text-sm">
                        <p>AI will analyze the photo to find:</p>
                        <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Store Name</li>
                            <li>Menu Items</li>
                            <li>Location (GPS)</li>
                        </ul>
                    </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisionSearch;
