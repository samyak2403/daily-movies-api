# daily-movies-api

An automated pipeline that discovers YouTube movies daily and outputs structured JSON for a frontend to consume.

## Architecture
- Python discovery script using `yt-dlp` to get metadata for Hindi, Marathi, and English movies without API limits.
- GitHub Actions workflow that executes the scraper every day and pushes the generated `movies/movies.json` strictly to this repository.

## Installation
Run `pip install -r requirements.txt` and then run `python scripts/scraper.py`.

## 📱 How to Use in Android App

You can easily integrate this movie data into your Android app by fetching the raw JSON file hosted on this repository.

### API Endpoint (Raw JSON URL)
```text
https://raw.githubusercontent.com/samyak2403/daily-movies-api/main/movies/movies.json
```

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
