// Spotify Clone JavaScript
class SpotifyClone {
    constructor() {
        this.currentSong = null;
        this.currentPlaylist = [];
        this.currentIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.isRepeating = false;
        this.volume = 0.7;
        this.currentView = 'home';
        
        // Sample music data
        this.songs = [
            {
                id: 1,
                title: "Blinding Lights",
                artist: "The Weeknd",
                album: "After Hours",
                duration: "3:20",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
            },
            {
                id: 2,
                title: "Watermelon Sugar",
                artist: "Harry Styles",
                album: "Fine Line",
                duration: "2:54",
                image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            },
            {
                id: 3,
                title: "Good 4 U",
                artist: "Olivia Rodrigo",
                album: "SOUR",
                duration: "2:58",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            },
            {
                id: 4,
                title: "Levitating",
                artist: "Dua Lipa",
                album: "Future Nostalgia",
                duration: "3:23",
                image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
            },
            {
                id: 5,
                title: "Stay",
                artist: "The Kid LAROI, Justin Bieber",
                album: "Stay",
                duration: "2:21",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
            },
            {
                id: 6,
                title: "Anti-Hero",
                artist: "Taylor Swift",
                album: "Midnights",
                duration: "3:20",
                image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
            },
            {
                id: 7,
                title: "As It Was",
                artist: "Harry Styles",
                album: "Harry's House",
                duration: "2:47",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
            },
            {
                id: 8,
                title: "Heat Waves",
                artist: "Glass Animals",
                album: "Dreamland",
                duration: "3:58",
                image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
            },
            {
                id: 9,
                title: "Industry Baby",
                artist: "Lil Nas X, Jack Harlow",
                album: "MONTERO",
                duration: "3:32",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
            },
            {
                id: 10,
                title: "Bad Habit",
                artist: "Steve Lacy",
                album: "Gemini Rights",
                duration: "3:52",
                image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
            }
        ];

        this.playlists = [
            {
                id: 1,
                name: "Liked Songs",
                description: "Your favorite tracks",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
                songs: [1, 2, 3, 4, 5]
            },
            {
                id: 2,
                name: "Daily Mix 1",
                description: "Harry Styles, The Weeknd and more",
                image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
                songs: [1, 2, 7]
            },
            {
                id: 3,
                name: "Today's Top Hits",
                description: "The hottest songs right now",
                image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
                songs: [3, 5, 6, 9]
            },
            {
                id: 4,
                name: "Pop Rising",
                description: "New and next in pop",
                image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
                songs: [4, 6, 8, 10]
            }
        ];

        this.likedSongs = new Set([1, 3, 5]);
        this.init();
    }

    init() {
        this.setupAudioPlayer();
        this.setupEventListeners();
        this.updateGreeting();
        this.renderContent();
        this.setupKeyboardControls();
    }

    setupAudioPlayer() {
        this.audio = document.getElementById('audioPlayer');
        this.audio.volume = this.volume;
        
        this.audio.addEventListener('loadedmetadata', () => {
            this.updateTotalTime();
        });

        this.audio.addEventListener('timeupdate', () => {
            this.updateProgress();
        });

        this.audio.addEventListener('ended', () => {
            this.nextSong();
        });

        this.audio.addEventListener('error', (e) => {
            console.warn('Audio loading error, playing silence');
            this.handleAudioError();
        });
    }

    handleAudioError() {
        // Create a short silent audio when external sources fail
        const context = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);
        gainNode.gain.setValueAtTime(0, context.currentTime);
        oscillator.frequency.setValueAtTime(440, context.currentTime);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.1);
        
        // Show a message that song is playing (simulated)
        this.isPlaying = true;
        this.updatePlayButton();
        
        // Simulate progress
        this.simulateProgress();
    }

    simulateProgress() {
        if (!this.isPlaying || !this.currentSong) return;
        
        const duration = this.parseDuration(this.currentSong.duration);
        let currentTime = 0;
        
        const interval = setInterval(() => {
            if (!this.isPlaying) {
                clearInterval(interval);
                return;
            }
            
            currentTime += 1;
            const progress = (currentTime / duration) * 100;
            
            document.getElementById('progress').style.width = progress + '%';
            document.getElementById('currentTime').textContent = this.formatTime(currentTime);
            
            if (currentTime >= duration) {
                clearInterval(interval);
                this.nextSong();
            }
        }, 1000);
    }

    parseDuration(durationStr) {
        const parts = durationStr.split(':');
        return parseInt(parts[0]) * 60 + parseInt(parts[1]);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const view = e.currentTarget.dataset.view;
                if (view) {
                    this.switchView(view);
                }
            });
        });

        // Sidebar toggle
        document.getElementById('sidebarToggle').addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });

        // Player controls
        document.getElementById('playBtn').addEventListener('click', () => {
            this.togglePlay();
        });

        document.getElementById('nextBtn').addEventListener('click', () => {
            this.nextSong();
        });

        document.getElementById('prevBtn').addEventListener('click', () => {
            this.previousSong();
        });

        document.getElementById('shuffleBtn').addEventListener('click', () => {
            this.toggleShuffle();
        });

        document.getElementById('repeatBtn').addEventListener('click', () => {
            this.toggleRepeat();
        });

        document.getElementById('likeButton').addEventListener('click', () => {
            this.toggleLike();
        });

        // Progress bar
        document.getElementById('progressContainer').addEventListener('click', (e) => {
            this.seekTo(e);
        });

        // Volume control
        document.getElementById('volumeContainer').addEventListener('click', (e) => {
            this.setVolume(e);
        });

        document.getElementById('volumeBtn').addEventListener('click', () => {
            this.toggleMute();
        });

        // Search
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        document.getElementById('searchClear').addEventListener('click', () => {
            searchInput.value = '';
            this.handleSearch('');
        });

        // Library tabs
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.switchLibraryTab(tab);
            });
        });
    }

    setupKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            
            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    this.togglePlay();
                    break;
                case 'ArrowRight':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.nextSong();
                    }
                    break;
                case 'ArrowLeft':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.previousSong();
                    }
                    break;
            }
        });
    }

    updateGreeting() {
        const hour = new Date().getHours();
        let greeting = 'Good evening';
        
        if (hour < 12) greeting = 'Good morning';
        else if (hour < 18) greeting = 'Good afternoon';
        
        document.getElementById('greeting').textContent = greeting;
    }

    switchView(view) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-view="${view}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-view').forEach(view => {
            view.classList.remove('active');
        });
        document.getElementById(`${view}View`).classList.add('active');

        this.currentView = view;

        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('open');
        }

        // Load view-specific content
        if (view === 'library') {
            this.renderLibraryContent();
        }
    }

    renderContent() {
        this.renderRecentlyPlayed();
        this.renderMadeForYou();
        this.renderUserPlaylists();
    }

    renderRecentlyPlayed() {
        const container = document.getElementById('recentlyPlayed');
        const recentSongs = this.songs.slice(0, 6);
        
        container.innerHTML = recentSongs.map(song => `
            <div class="music-item" onclick="app.playSong(${song.id})">
                <img src="${song.image}" alt="${song.title}" class="music-image">
                <div class="music-title">${song.title}</div>
                <div class="music-artist">${song.artist}</div>
                <button class="play-overlay" onclick="event.stopPropagation(); app.playSong(${song.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `).join('');
    }

    renderMadeForYou() {
        const container = document.getElementById('madeForYou');
        
        container.innerHTML = this.playlists.map(playlist => `
            <div class="music-item" onclick="app.playPlaylist(${playlist.id})">
                <img src="${playlist.image}" alt="${playlist.name}" class="music-image">
                <div class="music-title">${playlist.name}</div>
                <div class="music-artist">${playlist.description}</div>
                <button class="play-overlay" onclick="event.stopPropagation(); app.playPlaylist(${playlist.id})">
                    <i class="fas fa-play"></i>
                </button>
            </div>
        `).join('');
    }

    renderUserPlaylists() {
        const container = document.getElementById('userPlaylists');
        
        container.innerHTML = this.playlists.map(playlist => `
            <div class="playlist-item" onclick="app.playPlaylist(${playlist.id})">
                <img src="${playlist.image}" alt="${playlist.name}" class="playlist-image">
                <div class="playlist-info">
                    <div class="playlist-name">${playlist.name}</div>
                    <div class="playlist-count">${playlist.songs.length} songs</div>
                </div>
            </div>
        `).join('');
    }

    renderLibraryContent(tab = 'playlists') {
        const container = document.getElementById('libraryContent');
        
        if (tab === 'playlists') {
            container.innerHTML = `
                <div class="library-item" onclick="app.playLikedSongs()">
                    <div class="playlist-icon liked-songs">
                        <i class="fas fa-heart"></i>
                    </div>
                    <div class="playlist-info">
                        <div class="playlist-name">Liked Songs</div>
                        <div class="playlist-count">${this.likedSongs.size} songs</div>
                    </div>
                </div>
                ${this.playlists.map(playlist => `
                    <div class="library-item" onclick="app.playPlaylist(${playlist.id})">
                        <img src="${playlist.image}" alt="${playlist.name}" class="playlist-image">
                        <div class="playlist-info">
                            <div class="playlist-name">${playlist.name}</div>
                            <div class="playlist-count">${playlist.songs.length} songs</div>
                        </div>
                    </div>
                `).join('')}
            `;
        }
    }

    switchLibraryTab(tab) {
        document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        this.renderLibraryContent(tab);
    }

    playSong(songId, playlist = null) {
        const song = this.songs.find(s => s.id === songId);
        if (!song) return;

        this.currentSong = song;
        
        if (playlist) {
            this.currentPlaylist = playlist;
            this.currentIndex = playlist.findIndex(s => s.id === songId);
        } else {
            this.currentPlaylist = this.songs;
            this.currentIndex = this.songs.findIndex(s => s.id === songId);
        }

        this.updateCurrentSongDisplay();
        this.updateLikeButton();

        // Try to load actual audio, fallback to simulation
        this.audio.src = song.audio;
        this.audio.load();
        
        this.audio.play().then(() => {
            this.isPlaying = true;
            this.updatePlayButton();
        }).catch(() => {
            // Fallback to simulation if audio fails
            this.handleAudioError();
        });
    }

    playPlaylist(playlistId) {
        const playlist = this.playlists.find(p => p.id === playlistId);
        if (!playlist) return;

        const playlistSongs = playlist.songs.map(id => this.songs.find(s => s.id === id)).filter(Boolean);
        if (playlistSongs.length > 0) {
            this.playSong(playlistSongs[0].id, playlistSongs);
        }
    }

    playLikedSongs() {
        const likedSongs = Array.from(this.likedSongs).map(id => this.songs.find(s => s.id === id)).filter(Boolean);
        if (likedSongs.length > 0) {
            this.playSong(likedSongs[0].id, likedSongs);
        }
    }

    togglePlay() {
        if (!this.currentSong) {
            // Play first song if nothing is selected
            this.playSong(this.songs[0].id);
            return;
        }

        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
        } else {
            this.audio.play().catch(() => {
                // Simulate play if audio fails
                this.handleAudioError();
            });
        }
        
        this.updatePlayButton();
    }

    nextSong() {
        if (this.currentPlaylist.length === 0) return;

        if (this.isShuffled) {
            this.currentIndex = Math.floor(Math.random() * this.currentPlaylist.length);
        } else {
            this.currentIndex = (this.currentIndex + 1) % this.currentPlaylist.length;
        }

        this.playSong(this.currentPlaylist[this.currentIndex].id, this.currentPlaylist);
    }

    previousSong() {
        if (this.currentPlaylist.length === 0) return;

        this.currentIndex = this.currentIndex - 1;
        if (this.currentIndex < 0) {
            this.currentIndex = this.currentPlaylist.length - 1;
        }

        this.playSong(this.currentPlaylist[this.currentIndex].id, this.currentPlaylist);
    }

    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        const btn = document.getElementById('shuffleBtn');
        btn.classList.toggle('active', this.isShuffled);
    }

    toggleRepeat() {
        this.isRepeating = !this.isRepeating;
        const btn = document.getElementById('repeatBtn');
        btn.classList.toggle('active', this.isRepeating);
        
        this.audio.loop = this.isRepeating;
    }

    toggleLike() {
        if (!this.currentSong) return;

        const songId = this.currentSong.id;
        if (this.likedSongs.has(songId)) {
            this.likedSongs.delete(songId);
        } else {
            this.likedSongs.add(songId);
        }
        
        this.updateLikeButton();
    }

    toggleMute() {
        if (this.audio.volume > 0) {
            this.previousVolume = this.audio.volume;
            this.audio.volume = 0;
            document.getElementById('volumeProgress').style.width = '0%';
            document.getElementById('volumeBtn').innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else {
            this.audio.volume = this.previousVolume || 0.7;
            document.getElementById('volumeProgress').style.width = (this.audio.volume * 100) + '%';
            document.getElementById('volumeBtn').innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    seekTo(e) {
        if (!this.currentSong) return;

        const progressBar = document.getElementById('progressContainer');
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        
        if (this.audio.duration) {
            this.audio.currentTime = percent * this.audio.duration;
        }
    }

    setVolume(e) {
        const volumeBar = document.getElementById('volumeContainer');
        const rect = volumeBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        
        this.volume = percent;
        this.audio.volume = percent;
        document.getElementById('volumeProgress').style.width = (percent * 100) + '%';
        
        const volumeBtn = document.getElementById('volumeBtn');
        if (percent === 0) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        } else if (percent < 0.5) {
            volumeBtn.innerHTML = '<i class="fas fa-volume-down"></i>';
        } else {
            volumeBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        }
    }

    handleSearch(query) {
        const resultsContainer = document.getElementById('searchResults');
        
        if (!query.trim()) {
            resultsContainer.innerHTML = `
                <div class="no-search">
                    <h3>Browse all</h3>
                    <div class="genre-grid">
                        <div class="genre-card" style="background: var(--color-bg-1);"><span>Pop</span></div>
                        <div class="genre-card" style="background: var(--color-bg-2);"><span>Hip-Hop</span></div>
                        <div class="genre-card" style="background: var(--color-bg-3);"><span>Rock</span></div>
                        <div class="genre-card" style="background: var(--color-bg-4);"><span>Electronic</span></div>
                        <div class="genre-card" style="background: var(--color-bg-5);"><span>Indie</span></div>
                        <div class="genre-card" style="background: var(--color-bg-6);"><span>Jazz</span></div>
                    </div>
                </div>
            `;
            return;
        }

        const filteredSongs = this.songs.filter(song => 
            song.title.toLowerCase().includes(query.toLowerCase()) ||
            song.artist.toLowerCase().includes(query.toLowerCase()) ||
            song.album.toLowerCase().includes(query.toLowerCase())
        );

        resultsContainer.innerHTML = `
            <div class="search-section">
                <h3>Songs</h3>
                <div class="music-grid">
                    ${filteredSongs.map(song => `
                        <div class="music-item" onclick="app.playSong(${song.id})">
                            <img src="${song.image}" alt="${song.title}" class="music-image">
                            <div class="music-title">${song.title}</div>
                            <div class="music-artist">${song.artist}</div>
                            <button class="play-overlay" onclick="event.stopPropagation(); app.playSong(${song.id})">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    updateCurrentSongDisplay() {
        if (!this.currentSong) return;

        document.getElementById('currentImage').src = this.currentSong.image;
        document.getElementById('currentTitle').textContent = this.currentSong.title;
        document.getElementById('currentArtist').textContent = this.currentSong.artist;
        document.getElementById('totalTime').textContent = this.currentSong.duration;
    }

    updatePlayButton() {
        const playBtn = document.getElementById('playBtn');
        const icon = playBtn.querySelector('i');
        
        if (this.isPlaying) {
            icon.className = 'fas fa-pause';
        } else {
            icon.className = 'fas fa-play';
        }
    }

    updateLikeButton() {
        if (!this.currentSong) return;

        const likeBtn = document.getElementById('likeButton');
        const icon = likeBtn.querySelector('i');
        
        if (this.likedSongs.has(this.currentSong.id)) {
            icon.className = 'fas fa-heart';
            likeBtn.classList.add('liked');
        } else {
            icon.className = 'far fa-heart';
            likeBtn.classList.remove('liked');
        }
    }

    updateProgress() {
        if (!this.audio.duration) return;

        const progress = (this.audio.currentTime / this.audio.duration) * 100;
        document.getElementById('progress').style.width = progress + '%';
        document.getElementById('currentTime').textContent = this.formatTime(this.audio.currentTime);
    }

    updateTotalTime() {
        document.getElementById('totalTime').textContent = this.formatTime(this.audio.duration);
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize the app
const app = new SpotifyClone();

// Handle responsive design
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        document.getElementById('sidebar').classList.remove('open');
    }
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    
    if (window.innerWidth <= 768 && 
        sidebar.classList.contains('open') && 
        !sidebar.contains(e.target) && 
        !sidebarToggle.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});