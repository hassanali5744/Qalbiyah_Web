import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const ReadQuranSubPage = () => {
  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const surahNumber = searchParams.get('surah');

  useEffect(() => {
    const fetchSurahData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/surah/${surahNumber}`);
        setSurahData(response.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load surah data');
      } finally {
        setLoading(false);
      }
    };

    if (surahNumber) {
      fetchSurahData();
    }
  }, [surahNumber]);

  if (loading) {
    return <div className="text-center py-8">Loading Surah data...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!surahData) {
    return <div className="text-center py-8">Surah not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">
          {surahData.english_name} ({surahData.surah_name})
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Surah {surahData.surah_number} • {surahData.revelation_type}
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="space-y-6">
            {surahData.ayats.map((ayat) => (
              <div key={`${surahData.id}-${ayat.ayat_number}`} className="verse-item">
                <div className="flex items-start">
                  <span className="verse-number bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 mt-1">
                    {ayat.ayat_number}
                  </span>
                  <div className="flex-1">
                    <p className="text-2xl font-arabic mb-2 text-right">
                      {ayat.ayat_text}
                    </p>
                    {/* Add translation here if you have it */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReadQuranSubPage;