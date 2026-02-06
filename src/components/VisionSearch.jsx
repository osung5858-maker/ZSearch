
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
                    onClick={() => fileInputRef.current.click()}
                    className="w-full md:w-1/2 h-48 border-2 border-dashed border-blue-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors bg-gray-50"
                >
                    {image ? (
                        <img src={image} alt="Preview" className="h-full w-full object-cover rounded-xl" />
                    ) : (
                        <>
                            <svg className="w-12 h-12 text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            <span className="text-sm text-gray-500 font-medium">Upload Storefront or Menu</span>
                        </>
                    )}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </div>

                <div className="w-full md:w-1/2">
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
                        <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                            <div className="text-green-700 font-bold mb-1 flex items-center">
                                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                Analysis Complete
                            </div>
                            <p className="text-sm text-gray-600 mb-2">Identified: <strong>Starbucks Gangnam</strong></p>
                            <button className="text-xs bg-white border border-green-300 px-2 py-1 rounded text-green-700 font-bold">
                                Searching for "Coffee"...
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
