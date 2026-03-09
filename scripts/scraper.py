import yt_dlp
import json
import os
import time
from datetime import datetime

# Categories to search for in YouTube
CATEGORIES = {
    "Hindi": "full movie hindi",
    "Marathi": "full movie marathi",
    "English": "full movie english",
}

# Number of results per category to fetch
RESULTS_PER_CATEGORY = 15

def scrape_movies():
    all_movies = []
    
    # yt-dlp options for fast metadata extraction without downloading videos
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'force_generic_extractor': False,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        for category, query in CATEGORIES.items():
            print(f"Searching for {category} movies...")
            # Use 'ytsearch<N>:' to search YouTube directly
            search_query = f"ytsearch{RESULTS_PER_CATEGORY}:{query}"
            
            try:
                result = ydl.extract_info(search_query, download=False)
                if 'entries' in result:
                    for video in result['entries']:
                        # Some results might be missing, ensure it's a valid dict
                        if not video:
                            continue
                            
                        # Filter out shorts or very short videos (typically movies are > 3600 seconds)
                        duration = video.get('duration', 0)
                        if duration and duration < 2400: # Less than 40 minutes probably not a full movie
                            continue
                            
                        movie_data = {
                            "id": video.get('id'),
                            "title": video.get('title'),
                            "url": video.get('url'),
                            "duration": duration,
                            "view_count": video.get('view_count'),
                            "uploader": video.get('uploader'),
                            "category": category,
                            "thumbnail": video.get('thumbnails', [{}])[-1].get('url', '') if video.get('thumbnails') else None
                        }
                        
                        # Only add if we have ID and title to avoid broken data
                        if movie_data['id'] and movie_data['title']:
                            all_movies.append(movie_data)
                            print(f"[{time.strftime('%X')}] Added movie: {movie_data['title']}")
                            time.sleep(1) # Add a 1 second delay between fetching movies
                            
            except Exception as e:
                print(f"Error scraping category {category}: {e}")

    # Remove duplicates based on video ID (in case a movie appears in multiple searches)
    unique_movies = {movie['id']: movie for movie in all_movies}.values()
    
    return list(unique_movies)

def save_to_json(data, filename="movies/movies.json"):
    # Create the directory if it doesn't exist
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    # Output structure perfect for a frontend store
    output = {
        "last_updated": datetime.utcnow().isoformat() + "Z",
        "total_movies": len(data),
        "movies": data
    }
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=4, ensure_ascii=False)
    print(f"Successfully saved {len(data)} movies to {filename}")

if __name__ == "__main__":
    print(f"Starting YouTube movie discovery at {datetime.now()}...")
    movies = scrape_movies()
    save_to_json(movies)
    print("Done!")
