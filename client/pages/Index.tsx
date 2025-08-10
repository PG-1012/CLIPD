import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage, AvatarFallback } from "../components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { useHeadlines } from "../hooks/use-headlines";
import { NewsSource } from "../../shared/api";

export default function Index() {
  // User info (could be dynamic in a real app)
  const user = {
    name: "Alex",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face"
  };

  // State for search/filter and source selection
  const [search, setSearch] = useState("");
  const [selectedSource, setSelectedSource] = useState<NewsSource>("bbc");
  // State for audio playback
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([]);

  // Fetch headlines from backend
  const { data, isLoading, error, refetch } = useHeadlines(selectedSource);

  // Filter articles by search
  const filteredArticles = data?.headlines.filter(article =>
    article.title.toLowerCase().includes(search.toLowerCase()) ||
    article.summary.toLowerCase().includes(search.toLowerCase())
  ) || [];

  // Handle play/pause (placeholder for future audio functionality)
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

  // Handle source change
  const handleSourceChange = (source: string) => {
    setSelectedSource(source as NewsSource);
  };

  // Generate placeholder image based on title
  const getPlaceholderImage = (title: string) => {
    const hash = title.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    const hue = Math.abs(hash) % 360;
    return `https://via.placeholder.com/400x400/${hue.toString(16).padStart(6, '0')}/ffffff?text=${encodeURIComponent(title.substring(0, 20))}`;
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

        {/* Source Selection */}
        <div className="px-4 mb-2">
          <Select value={selectedSource} onValueChange={handleSourceChange}>
            <SelectTrigger className="bg-gray-800 text-white border-gray-700">
              <SelectValue placeholder="Select news source" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bbc">BBC News</SelectItem>
              <SelectItem value="reuters">Reuters</SelectItem>
              <SelectItem value="npr">NPR</SelectItem>
            </SelectContent>
          </Select>
        </div>

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
          {isLoading ? (
            <div className="text-center text-gray-400 mt-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              Loading headlines...
            </div>
          ) : error ? (
            <div className="text-center text-red-400 mt-8">
              <p className="mb-2">Failed to load headlines</p>
              <Button onClick={() => refetch()} variant="outline" size="sm">
                Try Again
              </Button>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              {search ? "No articles found matching your search." : "No headlines available."}
            </div>
          ) : (
            filteredArticles.map((article, idx) => (
              <Card key={idx} className="mb-4 bg-gray-800">
                <div className="flex gap-4 items-center">
                  <img
                    src={getPlaceholderImage(article.title)}
                    alt={article.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <CardHeader className="p-0 pb-1">
                      <CardTitle className="text-base mb-1">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 text-sm text-gray-300 mb-2">
                      {article.summary}
                    </CardContent>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {selectedSource.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-gray-400">
                        {article.text.length > 0 ? "Full article available" : "Summary only"}
                      </span>
                    </div>
                    {/* Audio Playback Widget (placeholder for future functionality) */}
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePlayPause(idx)}
                        className="px-3"
                        disabled
                      >
                        {playingId === idx ? "Pause" : "Play"}
                      </Button>
                      <audio
                        ref={el => (audioRefs.current[idx] = el)}
                        onEnded={handleEnded}
                        preload="none"
                      />
                      <span className="text-xs text-gray-400">Audio (Coming Soon)</span>
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
