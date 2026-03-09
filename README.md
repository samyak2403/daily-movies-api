# daily-movies-api

An automated pipeline that discovers YouTube movies daily and outputs structured JSON for a frontend to consume.

## Architecture
- Python discovery script using `yt-dlp` to get metadata for Hindi, Marathi, and English movies without API limits.
- GitHub Actions workflow that executes the scraper every day and pushes the generated `movies/movies.json` strictly to this repository.

## Installation
Run `pip install -r requirements.txt` and then run `python scripts/scraper.py`.
