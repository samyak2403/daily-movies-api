# daily-movies-api

An automated pipeline that discovers YouTube movies daily and outputs structured JSON for a frontend to consume.

## Architecture
- Python scraper using `yt-dlp` to discover YouTube movies across **7 categories**: Hindi, Marathi, English, Tamil, Telugu, Kannada, and Cartoons.
- Movies are saved into **per-category folders** (e.g., `movies/hindi/hindi.json`) as well as a **combined** `movies/movies.json`.
- GitHub Actions runs automatically and pushes updated JSON files to this repository.

## Folder Structure
```
movies/
├── movies.json          ← All movies combined
├── hindi/hindi.json
├── marathi/marathi.json
├── english/english.json
├── tamil/tamil.json
├── telugu/telugu.json
├── kannada/kannada.json
└── cartoons/cartoons.json
```

## Installation
Run `pip install -r requirements.txt` and then run `python scripts/scraper.py`.

## 📱 How to Use in Android App

You can easily integrate this movie data into your Android app by fetching the raw JSON file hosted on this repository.

### API Endpoints (Raw JSON URLs)

| Category | URL |
|----------|-----|
| **All Movies** | `https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/movies.json` |
| Hindi | `https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/hindi/hindi.json` |
| Marathi | `https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/marathi/marathi.json` |
| English | `https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/english/english.json` |
| Tamil | `https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/tamil/tamil.json` |
| Telugu | `https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/telugu/telugu.json` |
| Kannada | `https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/kannada/kannada.json` |
| Cartoons | `https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/cartoons/cartoons.json` |


### 1. Data Model (Kotlin)
Create a data class to represent the movie object in your app:

```kotlin
data class Movie(
    val title: String,
    val link: String,
    val language: String,
    val id: String
)
```

### 2. Retrofit Interface
Set up a Retrofit interface to fetch the raw JSON:

```kotlin
import retrofit2.http.GET

interface MovieApiService {
    @GET("samyak2403/daily-movies-api/main/movies/movies.json")
    suspend fun getMovies(): List<Movie>
}
```

### 3. Retrofit Instance
Configure the Retrofit client with the base URL `https://raw.githubusercontent.com/`:

```kotlin
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

val retrofit = Retrofit.Builder()
    .baseUrl("https://raw.githubusercontent.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()

val movieApiService = retrofit.create(MovieApiService::class.java)
```

### 4. Fetch Data
Call the API from your ViewModel or Repository using Kotlin Coroutines:

```kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.launch

class MovieViewModel : ViewModel() {
    fun fetchMovies() {
        viewModelScope.launch {
            try {
                val moviesList = movieApiService.getMovies()
                // Update your UI with moviesList 
                // e.g., using MutableLiveData or StateFlow
            } catch (e: Exception) {
                // Handle the error
                e.printStackTrace()
            }
        }
    }
}
```
