import yt_dlp
import json
import os
import time
import re
from datetime import datetime

# Categories to search for in YouTube
CATEGORIES = {
    "hindi": "full movie hindi",
    "marathi": "full movie marathi",
    "english": "full movie english",
    "tamil": "full movie tamil",
    "telugu": "full movie telugu",
    "kannada": "full movie kannada",
    "cartoons": "cartoon full movie for kids",
    "cartoons_auto": "hindi cartoon full episodes",
    "comedy": "hindi comedy videos",
    "taarak_mehta": "taarak mehta ka ooltah chashmah",
    "yam_hain_hum": "yam hain hum",
}

# Hindi Cartoon Show Categories (subfolders inside cartoons/)
CARTOON_CATEGORIES = {
    "cartoons/oggy_and_the_cockroaches": "oggy and the cockroaches hindi full episodes",
    "cartoons/bandbudh_aur_budbak": "bandbudh aur budbak hindi full episodes",
    "cartoons/chhota_bheem": "chhota bheem hindi full episodes",
    "cartoons/motu_patlu": "motu patlu hindi full episodes",
    "cartoons/gattu_battu": "gattu battu hindi full episodes",
    "cartoons/doraemon": "doraemon hindi full episodes",
    "cartoons/ninja_hattori": "ninja hattori hindi full episodes",
    "cartoons/chacha_bhatija": "chacha bhatija hindi full episodes",
}

# Merge all categories
ALL_CATEGORIES = {**CATEGORIES, **CARTOON_CATEGORIES}

# Number of results per category to fetch
RESULTS_PER_CATEGORY = 15

# Base output directory
OUTPUT_DIR = "movies"


def extract_cartoon_name_and_category(title):
    """Extract cartoon name from video title."""
    delimiters = r'[|\-:]'
    parts = re.split(delimiters, title)
    
    if parts:
        name = parts[0].strip()
        name = re.sub(r'(?i)\b(hindi|full episode|cartoon|episodes|kids|in hindi|new episode|latest)\b', '', name).strip()
        name = re.sub(r'^[^a-zA-Z0-9]+', '', name)
        name = re.sub(r'[^a-zA-Z0-9]+$', '', name)
        name = name.strip()
        
        if 2 < len(name) < 40:
            sanitized = re.sub(r'[^a-zA-Z0-9]+', '_', name.lower()).strip('_')
            return name, f"cartoons/{sanitized}"
            
    return "Various Cartoons", "cartoons/various_cartoons"

def scrape_movies():
    """Scrape movies from YouTube and return them grouped by category."""
    all_movies = []

    # yt-dlp options for fast metadata extraction without downloading videos
    ydl_opts = {
        'quiet': True,
        'extract_flat': True,
        'force_generic_extractor': False,
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        for category, query in ALL_CATEGORIES.items():
            print(f"Searching for {category}...")
            # Use 'ytsearch<N>:' to search YouTube directly
            search_query = f"ytsearch{RESULTS_PER_CATEGORY}:{query}"

            try:
                result = ydl.extract_info(search_query, download=False)
                if 'entries' in result:
                    for video in result['entries']:
                        # Some results might be missing, ensure it's a valid dict
                        if not video:
                            continue

                        # Filter out shorts or very short videos
                        duration = video.get('duration', 0)
                        # Cartoons and comedy shows can be shorter, so use a lower threshold
                        short_categories = [
                            "cartoons", "comedy", "taarak_mehta", "yam_hain_hum",
                            "cartoons/oggy_and_the_cockroaches",
                            "cartoons/bandbudh_aur_budbak",
                            "cartoons/chhota_bheem",
                            "cartoons/motu_patlu",
                            "cartoons/gattu_battu",
                            "cartoons/doraemon",
                            "cartoons/ninja_hattori",
                            "cartoons/chacha_bhatija",
                        ]
                        min_duration = 600 if category in short_categories else 2400
                        if duration and duration < min_duration:
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
                            # Auto-detect cartoon name if category is cartoons_auto
                            if category == "cartoons_auto":
                                detected_name, new_category = extract_cartoon_name_and_category(movie_data['title'])
                                movie_data['category'] = new_category
                                movie_data['show_name'] = detected_name

                            all_movies.append(movie_data)
                            print(f"[{time.strftime('%X')}] Added movie: {movie_data['title']}")
                            time.sleep(1)  # Add a 1 second delay between fetching movies

            except Exception as e:
                print(f"Error scraping category {category}: {e}")

    # Remove duplicates based on video ID
    unique_movies = {movie['id']: movie for movie in all_movies}.values()

    return list(unique_movies)


def load_existing(filepath):
    """Load existing movies from a JSON file."""
    if os.path.exists(filepath):
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
                movies = existing_data.get('episodes', existing_data.get('movies', []))
                print(f"  Loaded {len(movies)} existing movies from {filepath}")
                return movies
        except Exception as e:
            print(f"  Could not read existing file {filepath}: {e}")
    return []


def save_json(movies_list, filepath, show_name=None, is_cartoon=False):
    """Save a list of movies to a JSON file with metadata."""
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    if is_cartoon:
        output = {
            "last_updated": datetime.utcnow().isoformat() + "Z",
            "show_name": show_name or "Unknown Cartoon",
            "language": "Hindi",
            "category": "cartoons",
            "description": f"Auto-generated category for {show_name or 'videos'}.",
            "total_episodes": len(movies_list),
            "episodes": movies_list
        }
    else:
        output = {
            "last_updated": datetime.utcnow().isoformat() + "Z",
            "total_movies": len(movies_list),
            "movies": movies_list
        }

    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(output, f, indent=4, ensure_ascii=False)
    print(f"  Saved {len(movies_list)} items to {filepath}")


def save_all(new_movies):
    """Save movies per-category into folders AND into a combined file."""

    # ── 1. Group new movies by category ──
    by_category = {}
    for movie in new_movies:
        cat = movie.get('category', 'uncategorized')
        by_category.setdefault(cat, []).append(movie)

    # ── 2. Save per-category files ──
    all_cat_keys = set(ALL_CATEGORIES.keys()) | set(by_category.keys())

    for cat in all_cat_keys:
        if cat == "cartoons_auto":
            continue

        cat_dir = os.path.join(OUTPUT_DIR, cat)
        # For cartoon subcategories like "cartoons/oggy_and_the_cockroaches",
        # the filename should be the last part (e.g. "oggy_and_the_cockroaches.json")
        cat_basename = cat.split("/")[-1]
        cat_file = os.path.join(cat_dir, f"{cat_basename}.json")

        existing = load_existing(cat_file)
        combined = existing + by_category.get(cat, [])
        unique = list({m['id']: m for m in combined}.values())

        print(f"[{cat}] {len(unique)} total movies")

        # Infer show name and if it is a cartoon
        is_cartoon = cat.startswith("cartoons/")
        show_name = cat_basename.replace('_', ' ').title()
        if unique and 'show_name' in unique[0]:
            show_name = unique[0]['show_name']

        save_json(unique, cat_file, show_name=show_name, is_cartoon=is_cartoon)

    # ── 3. Save combined file (all categories) ──
    combined_file = os.path.join(OUTPUT_DIR, "movies.json")
    existing_all = load_existing(combined_file)
    combined_all = existing_all + new_movies
    unique_all = list({m['id']: m for m in combined_all}.values())

    print(f"[all] {len(unique_all)} total movies")
    save_json(unique_all, combined_file)


if __name__ == "__main__":
    print(f"Starting YouTube movie discovery at {datetime.now()}...")
    movies = scrape_movies()
    save_all(movies)
    print("Done!")

