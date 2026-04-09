"use client";

import { useState, useEffect } from "react";

const mockContent = [
  { id: 1, type: "zombie", title: "Rage Bait: Why your job is useless", author: "HustleCulture", likes: "142k" },
  { id: 2, type: "zombie", title: "Mindless Dance #482", author: "TrendSetter", likes: "89k" },
  { id: 3, type: "mindful", title: "How to actually read 1 book a week", author: "BookWorm", likes: "12k" },
  { id: 4, type: "mindful", title: "Update from your best friend: Hiking!", author: "Sarah_J", likes: "42" },
  { id: 5, type: "zombie", title: "Clickbait: You won't believe what happened", author: "NewsViral", likes: "210k" },
  { id: 6, type: "mindful", title: "Deep Dive: Understanding the Dopamine Loop", author: "NeuroSci", likes: "5k" },
  { id: 7, type: "zombie", title: "ASMR: Cutting Soap for 10 minutes", author: "Satisfying_X", likes: "1.2M" },
  { id: 8, type: "mindful", title: "Photo from Mom: Family Dinner", author: "FamilyFirst", likes: "8" },
];

export default function InstagramProto() {
  const [mindfulMode, setMindfulMode] = useState(false);
  const [scrollCount, setScrollCount] = useState(0);
  const [showNudge, setShowNudge] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const filteredContent = mindfulMode 
    ? mockContent.filter(c => c.type === "mindful")
    : mockContent;

  const handleScroll = () => {
    setScrollCount(prev => {
      const next = prev + 1;
      if (next % 3 === 0 && !mindfulMode) {
        setShowNudge(true);
      }
      return next;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-sans">
      <div className="w-[375px] h-[700px] bg-white border-8 border-black rounded-[40px] relative overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="h-14 border-b flex items-center justify-between px-4 sticky top-0 bg-white z-10">
          <span className="font-bold text-xl italic">Instagram</span>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold text-gray-400">Mindful Mode</span>
            <button 
              onClick={() => {
                setMindfulMode(!mindfulMode);
                setShowNudge(false);
              }}
              className={`w-10 h-5 rounded-full relative transition-colors ${mindfulMode ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${mindfulMode ? 'left-5.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>

        {/* Feed */}
        <div className="flex-1 overflow-y-auto" onScroll={(e) => {
          const target = e.target as HTMLDivElement;
          if (target.scrollHeight - target.scrollTop === target.clientHeight) {
            handleScroll();
          }
        }}>
          {filteredContent.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="h-[600px] border-b relative flex flex-col justify-end p-6 bg-slate-900 text-white group">
              {/* Background Mockup */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/10 select-none">
                REEL VIDEO
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600" />
                  <span className="font-semibold text-sm">@{item.author}</span>
                  {item.type === 'mindful' && <span className="bg-green-500/20 text-green-400 text-[10px] px-1.5 py-0.5 rounded border border-green-500/30">Value Content</span>}
                </div>
                <p className="text-sm mb-4 leading-snug">{item.title}</p>
                <div className="flex gap-4 text-xs font-medium text-gray-300">
                  <span>❤️ {item.likes}</span>
                  <span>💬 4.2k</span>
                  <span>↗️ Share</span>
                </div>
              </div>

              {/* Sidebar actions */}
              <div className="absolute right-4 bottom-20 flex flex-col gap-6 items-center">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">❤️</div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">💬</div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">🔖</div>
              </div>
            </div>
          ))}
          <div className="h-20 flex items-center justify-center text-gray-400 text-sm">
            End of feed
          </div>
        </div>

        {/* Tab Bar */}
        <div className="h-14 border-t flex items-center justify-around px-4 bg-white">
          <span className="text-lg">🏠</span>
          <span className="text-lg">🔍</span>
          <span className="text-lg border-2 border-black rounded-md p-0.5">➕</span>
          <span className="text-lg">🎞️</span>
          <span className="text-lg">👤</span>
        </div>

        {/* Nudge Overlay */}
        {showNudge && (
          <div className="absolute inset-0 bg-black/80 z-20 flex items-center justify-center p-8 text-center animate-fade-in">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="text-3xl mb-4">🧘</div>
              <h2 className="font-bold text-xl mb-2">Flow Break</h2>
              <p className="text-sm text-gray-600 mb-6">
                You've been scrolling for 15 minutes. Is this content adding value to your day?
              </p>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setShowNudge(false)}
                  className="bg-black text-white rounded-lg py-3 font-semibold text-sm"
                >
                  Continue (Just 5 more min)
                </button>
                <button 
                  onClick={() => {
                    setMindfulMode(true);
                    setShowNudge(false);
                  }}
                  className="bg-green-100 text-green-700 rounded-lg py-3 font-semibold text-sm"
                >
                  Switch to Mindful Mode
                </button>
                <button 
                  onClick={() => {
                    setShowNudge(false);
                    setShowSummary(true);
                  }}
                  className="text-gray-400 text-xs py-2"
                >
                  Close App for now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Session Summary */}
        {showSummary && (
          <div className="absolute inset-0 bg-white z-30 flex flex-col items-center justify-center p-8 text-center">
            <h2 className="font-bold text-2xl mb-8 italic">Instagram Summary</h2>
            <div className="w-full space-y-4 mb-12">
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Time Spent</span>
                <span className="font-bold">22 Minutes</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Value Gained</span>
                <span className="font-bold text-green-600">+1 Insight</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="text-gray-500">Mindful Ratio</span>
                <span className="font-bold">12%</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mb-8 italic italic">
              "Instagram is better when it's meaningful."
            </p>
            <button 
              onClick={() => setShowSummary(false)}
              className="bg-black text-white w-full rounded-lg py-3 font-semibold"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>

      {/* Info text outside phone */}
      <div className="mt-8 max-w-md text-center">
        <h3 className="font-bold text-lg mb-2">PM Concept: Value-Based Retention</h3>
        <p className="text-sm text-gray-500">
          This prototype addresses the "Dopamine-Value Gap" identified in user feedback. 
          By introducing <strong>Mindful Mode</strong> and <strong>Flow Breaks</strong>, we shift from 
          "Addictive Consumption" to "Intentional Interaction".
        </p>
      </div>
    </div>
  );
}
