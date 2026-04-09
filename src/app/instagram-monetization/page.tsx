"use client";

import { useState, useEffect, useRef } from "react";

const mockContent = [
  { id: 1, type: "organic", title: "Video from best friend", author: "jake_v", engagement: 95 },
  { id: 2, type: "organic", title: "Travel guide for Bali", author: "wanderer", engagement: 80 },
  { id: 3, type: "organic", title: "Funny cat video", author: "cats_daily", engagement: 60 },
  { id: 4, type: "organic", title: "Educational tech review", author: "tech_guru", engagement: 88 },
  { id: 5, type: "organic", title: "Cooking recipe", author: "chef_m", engagement: 70 },
];

export default function MonetizationProto() {
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [sentiment, setSentiment] = useState(100); // 0-100
  const [adFrequency, setAdFrequency] = useState(4); // 1 ad every X posts
  const [revenue, setRevenue] = useState(0);
  const [sessionPosts, setSessionPosts] = useState<any[]>([]);
  const lastScrollTime = useRef(Date.now());
  const lastScrollY = useRef(0);

  // Simulation loop for algorithm
  useEffect(() => {
    const interval = setInterval(() => {
      // Algorithm Logic: 
      // 1. If scroll speed is HIGH (user is skimming), sentiment DROPS.
      // 2. If sentiment is LOW, REDUCE ad frequency to prevent churn.
      // 3. If user is ENGAGED (scroll speed low), INCREASE ad quality (higher revenue/post).
      
      setSentiment(prev => {
        if (scrollSpeed > 50) return Math.max(0, prev - 5);
        return Math.min(100, prev + 2);
      });

      // Adjust frequency based on sentiment
      if (sentiment < 30) setAdFrequency(8); // Lower ad load to save user
      else if (sentiment > 70) setAdFrequency(3); // Normal/High ad load
      else setAdFrequency(5);

    }, 1000);
    return () => clearInterval(interval);
  }, [scrollSpeed, sentiment]);

  const handleScroll = (e: any) => {
    const currentY = e.target.scrollTop;
    const currentTime = Date.now();
    const distance = Math.abs(currentY - lastScrollY.current);
    const time = currentTime - lastScrollTime.current;
    const speed = distance / (time / 100);
    
    setScrollSpeed(speed);
    lastScrollY.current = currentY;
    lastScrollTime.current = currentTime;

    // Simulate revenue generation
    if (currentY % 1000 < 50) {
      // Calculate revenue based on "Quality" of the session
      // High sentiment = Premium ads (more revenue)
      const adValue = sentiment > 70 ? 0.45 : 0.15;
      setRevenue(prev => prev + adValue);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 p-4 font-sans text-white">
      <div className="flex gap-8 max-w-6xl w-full">
        
        {/* Phone UI */}
        <div className="w-[375px] h-[700px] bg-white border-8 border-gray-800 rounded-[40px] relative overflow-hidden shadow-2xl flex flex-col text-black">
          <div className="h-14 border-b flex items-center justify-between px-6 bg-white sticky top-0 z-10">
            <span className="font-bold text-xl italic">Instagram</span>
            <div className="flex items-center gap-1 text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-bold">
              AI AD ENGINE ACTIVE
            </div>
          </div>

          <div className="flex-1 overflow-y-auto" onScroll={handleScroll}>
            {[...Array(20)].map((_, i) => {
              const isAd = i > 0 && i % adFrequency === 0;
              return (
                <div key={i} className={`h-[500px] border-b p-6 flex flex-col justify-end relative ${isAd ? 'bg-amber-50' : 'bg-gray-50'}`}>
                  {isAd ? (
                    <>
                      <div className="absolute top-4 left-6 flex items-center gap-2">
                        <span className="text-[10px] font-bold bg-amber-200 px-1.5 py-0.5 rounded">SPONSORED</span>
                        <span className="text-[10px] text-gray-500">Premium Placement</span>
                      </div>
                      <div className="flex-1 flex items-center justify-center text-amber-300 font-bold text-4xl opacity-20 select-none">ADVERTISEMENT</div>
                      <h4 className="font-bold text-lg mb-1">Modern Minimalist Watch</h4>
                      <p className="text-xs text-gray-500 mb-4 italic italic">"Because time is valuable. Don't waste it scrolling."</p>
                      <button className="bg-blue-600 text-white w-full py-2 rounded text-sm font-bold">Shop Now</button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600" />
                        <span className="font-semibold text-sm">@user_{i}</span>
                      </div>
                      <div className="flex-1 flex items-center justify-center text-gray-200 font-bold text-4xl opacity-20 select-none">ORGANIC POST</div>
                      <p className="text-sm">Random organic content to keep you engaged...</p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Dashboard Side */}
        <div className="flex-1 bg-slate-800 rounded-3xl p-8 border border-slate-700">
          <h2 className="text-2xl font-bold mb-2">Algorithm Dashboard</h2>
          <p className="text-slate-400 text-sm mb-8">Real-time simulation of "Dynamic Ad Load" algorithm.</p>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
              <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">Session Revenue</span>
              <span className="text-3xl font-mono text-green-400">${revenue.toFixed(2)}</span>
            </div>
            <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700">
              <span className="text-xs text-slate-500 uppercase tracking-widest block mb-1">User Sentiment</span>
              <span className={`text-3xl font-mono ${sentiment > 50 ? 'text-blue-400' : 'text-red-400'}`}>{sentiment}%</span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">SCROLL SPEED (Engagement Filter)</span>
                <span>{scrollSpeed.toFixed(0)} units/sec</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300" 
                  style={{ width: `${Math.min(100, scrollSpeed)}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">AD FREQUENCY (Dynamic)</span>
                <span>1 Ad every {adFrequency} posts</span>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500" 
                  style={{ width: `${(adFrequency / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 bg-blue-900/20 p-6 rounded-2xl border border-blue-800/50">
            <h3 className="font-bold text-blue-400 mb-2">How the Algorithm Changed:</h3>
            <ul className="text-sm space-y-3 text-slate-300">
              <li><strong className="text-white">Predictive Fatigue:</strong> We detect "Skimming" (high scroll speed) as a precursor to churn. The algorithm immediately drops ad load to save the session.</li>
              <li><strong className="text-white">Premium Yielding:</strong> When users are engaged (slow scroll, reading captions), we serve high-CPM "Interactive Ads" instead of standard "Banners."</li>
              <li><strong className="text-white">Revenue Preservation:</strong> Even with *fewer* ads, revenue is maintained because we only show ads when the "Attention Score" is high enough to justify premium pricing to advertisers.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
