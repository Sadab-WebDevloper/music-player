const fs = require('fs');
const https = require('https');

const queries = [
  "Arijit Singh Tum Hi Ho",
  "Arijit Singh Channa Mereya",
  "Arijit Singh Agar Tum Saath Ho",
  "Arijit Singh Kabira",
  "Arijit Singh Raabta",
  "Arijit Singh Samjhawan",
  "Arijit Singh Gerua",
  "Arijit Singh Zaalima",
  "Arijit Singh Khairiyat",
  "KK Tadap Tadap",
  "KK Aankhon Mein Teri",
  "KK Khuda Jaane",
  "KK Tu Hi Meri Shab Hai",
  "KK Yaaron",
  "KK Zara Sa",
  "KK Zindagi Do Pal Ki",
  "KK Dil Ibaadat",
  "KK Kya Mujhe Pyar Hai",
  "KK Alvida",
  "Atif Aslam Tere Bin",
  "Atif Aslam Pehli Nazar Mein",
  "Atif Aslam Tu Jaane Na",
  "Atif Aslam Jeena Jeena",
  "Atif Aslam Tera Hone Laga Hoon",
  "Atif Aslam Dil Diyan Gallan",
  "Atif Aslam O Saathi",
  "Atif Aslam Woh Lamhe Woh Baatein",
  "Atif Aslam Tere Sang Yaara",
  "Shreya Ghoshal Teri Ore",
  "Shreya Ghoshal Deewani Mastani",
  "Shreya Ghoshal Agar Tum Mil Jao",
  "Shreya Ghoshal Saans",
  "Shreya Ghoshal Barso Re",
  "Shreya Ghoshal Sunn Raha Hai",
  "Sonu Nigam Kal Ho Naa Ho",
  "Sonu Nigam Abhi Mujh Mein Kahin",
  "Sonu Nigam Suraj Hua Maddham",
  "Sonu Nigam Main Agar Kahoon",
  "Mohit Chauhan Tum Se Hi",
  "Mohit Chauhan Pee Loon",
  "Mohit Chauhan Matargashti",
  "Mohit Chauhan Kun Faya Kun",
  "Mohit Chauhan Nadaan Parinde"
];

const fetchSong = (query) => {
  return new Promise((resolve) => {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&media=music&entity=song&limit=1`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (parsed.results && parsed.results.length > 0) {
            resolve(parsed.results[0]);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
};

const generate = async () => {
  console.log("Fetching real song previews from iTunes...");
  const songs = [];
  
  for (let i = 0; i < queries.length; i++) {
    const track = await fetchSong(queries[i]);
    if (track && track.previewUrl) {
      songs.push({
        id: `itunes-${track.trackId}`,
        title: track.trackName,
        artist: track.artistName,
        album: track.collectionName || 'Single',
        cover: track.artworkUrl100.replace('100x100bb', '500x500bb'), // Get high-res cover
        path: track.previewUrl,
        duration: 30, // iTunes previews are exactly 30s
        genre: track.primaryGenreName
      });
      console.log(`Fetched: ${track.trackName} by ${track.artistName}`);
    } else {
      console.log(`Skipped: ${queries[i]}`);
    }
    // Small delay to prevent rate limit
    await new Promise(r => setTimeout(r, 200));
  }

  const jsContent = `// Automatically generated from iTunes API
export const localSongs = ${JSON.stringify(songs, null, 2)};

export const mockPlaylists = [
  {
    id: "pl-1",
    name: "Bollywood Top Hits",
    description: "The best collection of real Bollywood tracks.",
    cover: localSongs[0]?.cover || "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop",
    songs: localSongs.slice(0, 10).map(s => s.id)
  },
  {
    id: "pl-2",
    name: "Arijit & KK Specials",
    description: "Heart touching tracks by legends.",
    cover: localSongs[10]?.cover || "https://images.unsplash.com/photo-1493225457124-a1a2a5f5646f?w=500&h=500&fit=crop",
    songs: localSongs.slice(10, 20).map(s => s.id)
  },
  {
    id: "pl-3",
    name: "Melodies of the Decade",
    description: "Unforgettable tunes.",
    cover: localSongs[20]?.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&h=500&fit=crop",
    songs: localSongs.slice(20, 30).map(s => s.id)
  }
];
`;

  fs.writeFileSync('./src/data/songs.js', jsContent);
  console.log("Successfully generated src/data/songs.js with real audio!");
};

generate();
