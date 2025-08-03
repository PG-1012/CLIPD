import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const SAMPLE_ARTICLES = [
  {
    id: 1,
    title: "AI Revolutionizes Mobile News Apps",
    description: "Discover how artificial intelligence is changing the way we consume news on mobile devices.",
    image: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?w=400&h=400&fit=crop&crop=center",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
  },
  {
    id: 2,
    title: "SpaceX Launches New Starlink Satellites",
    description: "SpaceX successfully launched another batch of Starlink satellites, expanding global internet coverage.",
    image: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop&crop=center",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
  },
  {
    id: 3,
    title: "Climate Change: What You Need to Know",
    description: "A quick guide to understanding the latest climate change news and what it means for you.",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop&crop=center",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
  }
];

export default function Index() {
  // User info (could be dynamic in a real app)
  const user = {
    name: "Alex",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
  };

  // State for search/filter
  const [search, setSearch] = useState("");
  // State for audio playback
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  // Filter articles by search
  const filteredArticles = SAMPLE_ARTICLES.filter(article =>
    article.title.toLowerCase().includes(search.toLowerCase()) ||
    article.description.toLowerCase().includes(search.toLowerCase())
  );

  // Handle play/pause
  const handlePlayPause = (id: number) => {
    if (playingId === id) {
      // Pause
      audioRefs.current[id]?.pause();
      setPlayingId(null);
    } else {
      // Pause any other
      if (playingId !== null) {
        audioRefs.current[playingId]?.pause();
      }
      audioRefs.current[id]?.play();
      setPlayingId(id);
    }
  };

  // Handle audio end
  const handleEnded = () => {
    setPlayingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-[393px] h-[844px] bg-black text-white overflow-hidden relative shadow-2xl flex flex-col">
        {/* User Greeting/Profile Card */}
        <Card className="m-4 mb-2 flex flex-row items-center gap-4 bg-gray-800">
          <Avatar>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg">Hello, {user.name}!</CardTitle>
            <span className="text-sm text-gray-400">Welcome back to CLIPD</span>
          </div>
        </Card>

        {/* Search/Filter Bar */}
        <div className="px-4 mb-2">
          <Input
            placeholder="Search topics or articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-gray-800 text-white border-gray-700 placeholder:text-gray-400"
          />
        </div>

        {/* Recent News/Topics */}
        <div className="flex-1 overflow-y-auto px-4 pb-2">
          {filteredArticles.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">No articles found.</div>
          ) : (
            filteredArticles.map((article, idx) => (
              <Card key={article.id} className="mb-4 bg-gray-800">
                <div className="flex gap-4 items-center">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <CardHeader className="p-0 pb-1">
                      <CardTitle className="text-base mb-1">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 text-sm text-gray-300 mb-2">
                      {article.description}
                    </CardContent>
                    {/* Audio Playback Widget */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePlayPause(idx)}
                        className="px-3"
                      >
                        {playingId === idx ? "Pause" : "Play"}
                      </Button>
                      <audio
                        ref={el => (audioRefs.current[idx] = el)}
                        src={article.audio}
                        onEnded={handleEnded}
                        preload="none"
                      />
                      <span className="text-xs text-gray-400">Audio</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-around items-center bg-gray-900 border-t border-gray-800 p-3">
          <Button asChild variant="ghost" className="flex-1 mx-1">
            <Link to="/settings">Settings</Link>
          </Button>
          <Button asChild variant="ghost" className="flex-1 mx-1">
            <Link to="/bookmarks">Bookmarks</Link>
          </Button>
          <Button asChild variant="ghost" className="flex-1 mx-1">
            <Link to="/topics">Browse Topics</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
