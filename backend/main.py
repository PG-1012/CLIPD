from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import feedparser
from newspaper import Article
from typing import List

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:8080"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RSS_FEEDS = {
    "bbc": "http://feeds.bbci.co.uk/news/world/rss.xml",
    "reuters": "https://ir.thomsonreuters.com/rss/news-releases.xml?items=15",
    "npr": "https://feeds.npr.org/1001/rss.xml"
}

@app.get("/api/headlines")
def get_headlines(
    source: str = Query("bbc", enum=["bbc", "reuters", "npr"])
):
    feed_url = RSS_FEEDS.get(source, RSS_FEEDS["bbc"])
    try:
        feed = feedparser.parse(feed_url)
        entries = feed.entries[:3]
        headlines = []
        for entry in entries:
            title = entry.get("title", "")
            summary = entry.get("summary", "")
            url = entry.get("link", "")
            article_text = ""
            try:
                article = Article(url)
                article.download()
                article.parse()
                article_text = article.text
            except Exception:
                article_text = ""
            headlines.append({
                "title": title,
                "summary": summary,
                "url": url,
                "text": article_text
            })
        return {"headlines": headlines}
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)}) 