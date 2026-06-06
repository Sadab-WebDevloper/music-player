import { localSongs, mockPlaylists } from '../data/songs';

// --- Local Data Mocking ---

export const getLocalSongs = async (search = '') => {
  if (!search) return localSongs;
  const lowerSearch = search.toLowerCase();
  return localSongs.filter(song => 
    song.title.toLowerCase().includes(lowerSearch) || 
    song.artist.toLowerCase().includes(lowerSearch) || 
    (song.album && song.album.toLowerCase().includes(lowerSearch))
  );
};

export const getTrendingLocalSongs = async () => {
  // Return all songs randomly sorted or first N for trending
  return localSongs.slice(0, 15);
};

export const getRecentlyPlayed = async () => {
  return localSongs.slice(0, 5);
};

// Favorites Mock (Use localStorage)
export const getLikedSongs = async () => {
  const likes = JSON.parse(localStorage.getItem('liked_songs') || '[]');
  return localSongs.filter(song => likes.includes(song.id));
};

export const toggleLikeSong = async (songId) => {
  let likes = JSON.parse(localStorage.getItem('liked_songs') || '[]');
  if (likes.includes(songId)) {
    likes = likes.filter(id => id !== songId);
  } else {
    likes.push(songId);
  }
  localStorage.setItem('liked_songs', JSON.stringify(likes));
  return { success: true, isLiked: likes.includes(songId) };
};

export const recordPlay = async (songId) => {
  // No-op for mock
  return { success: true };
};

// Playlists Mock
export const getPlaylists = async () => {
  const customPlaylists = JSON.parse(localStorage.getItem('custom_playlists') || '[]');
  return [...mockPlaylists, ...customPlaylists];
};

export const getPlaylistById = async (id) => {
  const allPlaylists = await getPlaylists();
  const playlist = allPlaylists.find(p => p.id === id);
  if (!playlist) return null;
  // Populate songs
  const populatedSongs = playlist.songs.map(songId => localSongs.find(s => s.id === songId)).filter(Boolean);
  return { ...playlist, songs: populatedSongs };
};

export const createPlaylist = async (playlistData) => {
  const customPlaylists = JSON.parse(localStorage.getItem('custom_playlists') || '[]');
  const newPlaylist = {
    id: `pl-custom-${Date.now()}`,
    name: playlistData.name,
    description: playlistData.description || '',
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=300&q=80',
    songs: []
  };
  customPlaylists.push(newPlaylist);
  localStorage.setItem('custom_playlists', JSON.stringify(customPlaylists));
  return newPlaylist;
};

export const deletePlaylist = async (id) => {
  let customPlaylists = JSON.parse(localStorage.getItem('custom_playlists') || '[]');
  customPlaylists = customPlaylists.filter(p => p.id !== id);
  localStorage.setItem('custom_playlists', JSON.stringify(customPlaylists));
  return { success: true };
};

export const addSongToPlaylist = async (playlistId, songId) => {
  let customPlaylists = JSON.parse(localStorage.getItem('custom_playlists') || '[]');
  const index = customPlaylists.findIndex(p => p.id === playlistId);
  if (index !== -1 && !customPlaylists[index].songs.includes(songId)) {
    customPlaylists[index].songs.push(songId);
    localStorage.setItem('custom_playlists', JSON.stringify(customPlaylists));
  }
  return { success: true };
};

export const removeSongFromPlaylist = async (playlistId, songId) => {
  let customPlaylists = JSON.parse(localStorage.getItem('custom_playlists') || '[]');
  const index = customPlaylists.findIndex(p => p.id === playlistId);
  if (index !== -1) {
    customPlaylists[index].songs = customPlaylists[index].songs.filter(id => id !== songId);
    localStorage.setItem('custom_playlists', JSON.stringify(customPlaylists));
  }
  return { success: true };
};



// Helper for fuzzy string matching (Levenshtein edit distance)
function getLevenshteinDistance(s1, s2) {
  const len1 = s1.length;
  const len2 = s2.length;
  const matrix = Array(len2 + 1).fill(null).map(() => Array(len1 + 1).fill(0));

  for (let i = 0; i <= len1; i++) matrix[0][i] = i;
  for (let j = 0; j <= len2; j++) matrix[j][0] = j;

  for (let j = 1; j <= len2; j++) {
    for (let i = 1; i <= len1; i++) {
      const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }
  return matrix[len2][len1];
}

const STOPWORDS = new Set(['ki', 'ke', 'ka', 'se', 'ko', 'me', 'mein', 'hi', 'ho', 'tha', 'thi', 'the', 'a', 'an', 'and', 'or', 'in', 'on', 'of', 'to', 'for', 'with', 'by', 'at', 'from', 'is', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'but', 'if', 'then', 'else']);

function isFuzzyMatch(word, targetWord) {
  const w1 = word.toLowerCase().trim();
  const w2 = targetWord.toLowerCase().trim();

  if (w1.length <= 1 || w2.length <= 1 || STOPWORDS.has(w1) || STOPWORDS.has(w2)) {
    return w1 === w2;
  }

  if (w2.includes(w1)) return true;

  const maxDistance = 1;
  if (getLevenshteinDistance(w1, w2) <= maxDistance) return true;

  return false;
}

function scoreTrack(track, query) {
  const qClean = query.toLowerCase().trim();
  const keywords = qClean.split(/\s+/).filter(k => k.length > 0);
  
  if (keywords.length === 0) return 0;

  const titleWords = track.title.toLowerCase().split(/[^\w\d]+/).filter(Boolean);
  const artistWords = track.artist.toLowerCase().split(/[^\w\d]+/).filter(Boolean);
  const albumWords = (track.album || '').toLowerCase().split(/[^\w\d]+/).filter(Boolean);
  const genreWords = (track.genre || '').toLowerCase().split(/[^\w\d]+/).filter(Boolean);

  let totalScore = 0;
  let matchedKeywordsCount = 0;
  let matchedNonStopwordsCount = 0;

  for (const kw of keywords) {
    let bestKwScore = 0;

    if (track.title.toLowerCase().includes(kw)) bestKwScore = Math.max(bestKwScore, 100);
    if (track.artist.toLowerCase().includes(kw)) bestKwScore = Math.max(bestKwScore, 90);
    if (track.album && track.album.toLowerCase().includes(kw)) bestKwScore = Math.max(bestKwScore, 50);

    if (bestKwScore === 0) {
      for (const tw of titleWords) {
        if (isFuzzyMatch(kw, tw)) { bestKwScore = Math.max(bestKwScore, 70); break; }
      }
      for (const aw of artistWords) {
        if (isFuzzyMatch(kw, aw)) { bestKwScore = Math.max(bestKwScore, 65); break; }
      }
      for (const albw of albumWords) {
        if (isFuzzyMatch(kw, albw)) { bestKwScore = Math.max(bestKwScore, 40); break; }
      }
      for (const gw of genreWords) {
        if (isFuzzyMatch(kw, gw)) { bestKwScore = Math.max(bestKwScore, 30); break; }
      }
    }

    if (bestKwScore > 0) {
      totalScore += bestKwScore;
      matchedKeywordsCount++;
      if (!STOPWORDS.has(kw)) matchedNonStopwordsCount++;
    }
  }

  if (matchedKeywordsCount === 0 || matchedNonStopwordsCount === 0) return 0;
  return totalScore * (matchedKeywordsCount / keywords.length);
}

export const searchSongs = async (query) => {
  if (!query || !query.trim()) return [];
  try {
    const allLocalSongs = await getLocalSongs('');

    const localResults = allLocalSongs
      .map(song => ({ ...song, score: scoreTrack(song, query) }))
      .filter(song => song.score > 0)
      .sort((a, b) => b.score - a.score);

    const seen = new Set();
    
    return localResults.filter(song => {
      const duplicateKey = `${song.title.toLowerCase().trim()}-${song.artist.toLowerCase().trim()}`;
      if (seen.has(duplicateKey)) return false;
      seen.add(duplicateKey);
      return true;
    });
  } catch (error) {
    console.error('Unified search error:', error);
    return [];
  }
};
