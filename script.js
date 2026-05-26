// ================================
// DOM Elements
// ================================
const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-icon');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const shuffleBtn = document.getElementById('shuffle');
const repeatBtn = document.getElementById('repeat');
const progress = document.getElementById('progress');
const progressThumb = document.getElementById('progress-thumb');
const progressContainer = document.getElementById('progress-container');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const cover = document.getElementById('cover-image');
const currentTimeEl = document.getElementById('current-time');
const durationEl = document.getElementById('duration');
const volumeSlider = document.getElementById('volume-slider');
const muteIcon = document.getElementById('mute-icon');
const muteBtn = document.getElementById('mute-btn');
const albumArt = document.getElementById('album-art');
const albumGlow = document.getElementById('album-glow');
const canvas = document.getElementById('particles-canvas');
const playlistEl = document.getElementById('playlist');
const playlistToggle = document.getElementById('playlist-toggle');
const playlistArrow = document.getElementById('playlist-arrow');

// ================================
// Song Data
// To add more songs: drop .mp3 files into the image/ folder
// and add entries here with the correct path.
// ================================
const songs = [
  {
    "name": "Born To Shine",
    "artist": "Diljit Dosanjh",
    "path": "image/Born To Shine.mp3",
    "cover": "image/1.jpg"
  },
  {
    "name": "Wavy",
    "artist": "Karan Aujla & Jay Trak",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/6e/d7/12/6ed71252-5ea1-e750-c32f-b022e6847471/mzaf_15658604173507661184.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/cd/df/5a/cddf5a8c-464e-3958-cf4a-7fac9e490aa5/5063616597178_cover.jpg/300x300bb.jpg"
  },
  {
    "name": "Winning Speech",
    "artist": "Karan Aujla & MXRCI",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/e3/ae/b6/e3aeb64f-cadd-5830-c39f-6af51cd91670/mzaf_6001527501800958065.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/48/7c/36/487c3668-f7a4-4b1a-e09e-c74dae124dd9/5063483578089_cover.jpg/300x300bb.jpg"
  },
  {
    "name": "Sifar Safar",
    "artist": "Karan Aujla",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/0b/a8/bd/0ba8bd4c-01ec-e160-d4d2-73846264eb9f/mzaf_16302755709357682866.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/b5/a1/5f/b5a15f57-7184-47a6-564e-272d515b4810/5063616203642_cover.jpg/300x300bb.jpg"
  },
  {
    "name": "Courtside",
    "artist": "Karan Aujla & Signature by SB",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/2f/0e/97/2f0e97ea-b598-ba94-e9cd-01a8415da350/mzaf_14090366633246550544.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/28/03/fe/2803feb5-cfa7-2c16-0ccb-2232d1613103/5021732792907.jpg/300x300bb.jpg"
  },
  {
    "name": "For A Reason",
    "artist": "Karan Aujla & Ikky",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/88/d0/c2/88d0c267-2901-be7d-2eaf-e816e8848135/mzaf_1951286537933087556.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/06/bd/e1/06bde161-335b-87fa-650a-f0d04bd9f55d/5021732889621.jpg/300x300bb.jpg"
  },
  {
    "name": "Morni",
    "artist": "Diljit Dosanjh, Chani Nattan & Tru-Skool",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4e/69/a7/4e69a729-ad4d-729e-1f4b-5502348669c4/mzaf_14021498751353860691.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/7f/0a/dd/7f0add4f-db6b-830d-bed1-4cc95dbed3ef/859736427250_cover.jpg/300x300bb.jpg"
  },
  {
    "name": "Ranjha",
    "artist": "Diljit Dosanjh, Sia & David Guetta",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/5a/a3/78/5aa37829-dae8-213b-a040-90fa0f6c4b1e/mzaf_5716806422335888455.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/7f/1b/93/7f1b933b-e8f8-fa07-6f20-70ad4d7e232a/5026854851488.jpg/300x300bb.jpg"
  },
  {
    "name": "Dealer",
    "artist": "Diljit Dosanjh",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/c9/f5/36/c9f53664-7e5f-1646-347a-a3836c6b24b4/mzaf_14025775664665894818.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/34/2e/84/342e8467-23ad-5338-95a6-13cfb3db50d7/859733419234_cover.jpg/300x300bb.jpg"
  },
  {
    "name": "G.O.A.T.",
    "artist": "Diljit Dosanjh",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/2e/33/31/2e333148-70fe-ea73-759f-f3af0a73eda1/mzaf_14222836181033911236.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/d2/89/ac/d289ac98-749e-3822-6b6e-b06aa4815715/859740651597_cover.jpg/300x300bb.jpg"
  },
  {
    "name": "Nain Matakka",
    "artist": "S.S. Thaman, Diljit Dosanjh, Dhee & Irshad Kamil",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/d7/18/3d/d7183d89-b40f-cbf7-780a-b69e2314e18e/mzaf_6518886814362287109.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a5/84/d9/a584d911-ced2-d90b-2895-3c3715f3cf2f/8909024115313.png/300x300bb.jpg"
  },
  {
    "name": "Pop",
    "artist": "Harry Styles",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/35/b6/a0/35b6a026-26bc-cfb1-30d3-9c3c1820c63f/mzaf_8281785747956416426.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/07/41/6a/07416a78-38b9-2d47-7ce8-8a52a44c510f/196874010112.jpg/300x300bb.jpg"
  },
  {
    "name": "วงกลม (Circle)",
    "artist": "P.O.P",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/63/2d/7a/632d7a07-fab2-4646-5b4a-50b65b712d70/mzaf_3317529337031832737.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/aa/ce/90/aace90e2-8a32-101b-8607-8e43026a6741/886443672253.jpg/300x300bb.jpg"
  },
  {
    "name": "เวลา (Time For Me And You) [Acoustic Version]",
    "artist": "P.O.P",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/f3/d2/66/f3d2669f-24d9-4cd5-735b-10c26a3b3771/mzaf_12911941596449109224.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/aa/ce/90/aace90e2-8a32-101b-8607-8e43026a6741/886443672253.jpg/300x300bb.jpg"
  },
  {
    "name": "ทำไม่ไหว (Can You Do That?)",
    "artist": "P.O.P",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/29/4b/ac/294bacc4-4926-e199-216b-bc2be4c77525/mzaf_9014921119643499503.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/aa/ce/90/aace90e2-8a32-101b-8607-8e43026a6741/886443672253.jpg/300x300bb.jpg"
  },
  {
    "name": "แค่ได้พบเธอ (Passer By Pt.2) [Acoustic version]",
    "artist": "P.O.P",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/5f/3e/83/5f3e839f-e3ec-2237-6915-af761017c3ff/mzaf_11231485996891014195.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/aa/ce/90/aace90e2-8a32-101b-8607-8e43026a6741/886443672253.jpg/300x300bb.jpg"
  },
  {
    "name": "เธอคือหัวใจ (You're My Soul) [Soul Mix]",
    "artist": "P.O.P",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/4c/1f/64/4c1f64a8-0cd5-65c7-eae0-ee1c953046eb/mzaf_1597225017649693731.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/aa/ce/90/aace90e2-8a32-101b-8607-8e43026a6741/886443672253.jpg/300x300bb.jpg"
  },
  {
    "name": "ไม่มี (Tomorrow With Nobody) [Acoustic Version]",
    "artist": "P.O.P",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/8b/6b/36/8b6b3682-35ee-5757-9a87-0af6971c3a0d/mzaf_9700179887012909748.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/aa/ce/90/aace90e2-8a32-101b-8607-8e43026a6741/886443672253.jpg/300x300bb.jpg"
  },
  {
    "name": "ตรงนี้ (Right Here)",
    "artist": "P.O.P",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/10/a8/a3/10a8a370-de0e-05a9-4c3f-cecd37708bf4/mzaf_1040385408260182334.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/aa/ce/90/aace90e2-8a32-101b-8607-8e43026a6741/886443672253.jpg/300x300bb.jpg"
  },
  {
    "name": "เธอ...คือหัวใจ (You're My Soul)",
    "artist": "P.O.P",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/fb/34/c9/fb34c99d-1cd3-56e3-923f-8b7ef691a260/mzaf_1422658047633646463.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/aa/ce/90/aace90e2-8a32-101b-8607-8e43026a6741/886443672253.jpg/300x300bb.jpg"
  },
  {
    "name": "ยอม (Completely)  [feat. Boyd Kosiyabong]",
    "artist": "P.O.P",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview116/v4/63/ac/cb/63accbbd-81a4-441a-08f3-d42b935e265d/mzaf_15595737796650385898.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music/v4/aa/ce/90/aace90e2-8a32-101b-8607-8e43026a6741/886443672253.jpg/300x300bb.jpg"
  },
  {
    "name": "Thinkin Bout You",
    "artist": "Frank Ocean",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview126/v4/8a/2c/35/8a2c35f6-ac70-560c-0a1c-516e105c6af8/mzaf_13522699475931524613.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/04/f8/63/04f863fc-2852-604f-c910-a97ac069506b/12UMGIM40339.rgb.jpg/300x300bb.jpg"
  },
  {
    "name": "bad guy",
    "artist": "Billie Eilish",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/c3/87/1f/c3871f7e-3260-d615-1c66-5fdca2c3a48f/mzaf_10721331211699880949.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/1a/37/d1/1a37d1b1-8508-54f2-f541-bf4e437dda76/19UMGIM05028.rgb.jpg/300x300bb.jpg"
  },
  {
    "name": "Location",
    "artist": "Khalid",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/9e/12/9e/9e129e1c-51b0-e387-c575-7f4452cd94f2/mzaf_4036558847286320225.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/f8/45/5a/f8455a71-8307-aa9a-9c95-3d22efe0804f/886446326146.jpg/300x300bb.jpg"
  },
  {
    "name": "POP!",
    "artist": "NAYEON",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/cc/74/22/cc7422df-1686-77ff-d3b0-2a2eb093fd76/mzaf_17159235851286493668.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/3f/49/ec/3f49ecb2-cb91-dd28-45b9-a31326d7e63b/738676859614_Cover.jpg/300x300bb.jpg"
  },
  {
    "name": "Pop",
    "artist": "*NSYNC",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/c4/d3/1b/c4d31be9-04a8-649e-18f9-a8e33d368642/mzaf_2388649982457011349.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/cc/e7/d1/cce7d167-f80b-4600-1fb8-cb586cf9a861/mzi.siscajhr.jpg/300x300bb.jpg"
  },
  {
    "name": "Meant to Be",
    "artist": "Bebe Rexha & Florida Georgia Line",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/fc/03/cf/fc03cf1d-a302-341f-d5d5-38211d6f032d/mzaf_6396742547607138168.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/4a/3b/65/4a3b65ee-a5c6-51e1-8476-e6501a98efa5/093624910763.jpg/300x300bb.jpg"
  },
  {
    "name": "Kill Bill",
    "artist": "SZA",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/45/2b/ea/452bead6-c7f5-82d4-f5f7-ec876014b4cc/mzaf_2905911853279084717.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music122/v4/bd/3b/a9/bd3ba9fb-9609-144f-bcfe-ead67b5f6ab3/196589564931.jpg/300x300bb.jpg"
  },
  {
    "name": "Take Me to Church",
    "artist": "Hozier",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/fb/95/fe/fb95fea4-aab2-151d-7e2d-a3b2740de243/mzaf_5007348610386911589.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/5e/1b/f1/5e1bf1de-e5f1-e73e-0752-e7882b4f2d57/886444718820.jpg/300x300bb.jpg"
  },
  {
    "name": "Too Good at Goodbyes",
    "artist": "Sam Smith",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/0c/9e/89/0c9e8972-be70-178a-049b-ec89fa7dc9bc/mzaf_12767949070659192881.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/c7/ee/26/c7ee26a6-8b1e-c224-4872-bb5df0614e64/17UM1IM18858.rgb.jpg/300x300bb.jpg"
  },
  {
    "name": "Something Just Like This",
    "artist": "The Chainsmokers & Coldplay",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/64/7f/96/647f9601-aa94-3599-6c73-0143510b8b92/mzaf_13538528720942742126.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/9d/56/6f/9d566f55-5253-bed6-5c31-df952dae649d/886446379289.jpg/300x300bb.jpg"
  },
  {
    "name": "Beautiful Things",
    "artist": "Benson Boone",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/4d/d5/00/4dd5006f-ee02-c3f1-94db-0ed4b8dd68f1/mzaf_14250561294796027079.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/54/f4/92/54f49210-e260-b519-ebbd-f4f40ee710cd/054391342751.jpg/300x300bb.jpg"
  },
  {
    "name": "Believer",
    "artist": "Imagine Dragons",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/7d/9c/8d/7d9c8d77-dc2c-6ab5-540a-063016ea0ee2/mzaf_13607919425161609621.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music126/v4/11/7a/b8/117ab805-6811-8929-18b9-0fad7baf0c25/17UMGIM98210.rgb.jpg/300x300bb.jpg"
  },
  {
    "name": "Thinking Out Loud",
    "artist": "Ed Sheeran",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview221/v4/78/a5/f2/78a5f25e-ad1b-718d-82ad-b82e676c1855/mzaf_6133970271589343093.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/2d/36/f9/2d36f9a7-2c3e-ce0f-7fb6-036feecb221f/825646974450.jpg/300x300bb.jpg"
  },
  {
    "name": "High Hopes",
    "artist": "Panic! At the Disco",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview122/v4/1b/68/b1/1b68b142-72f1-9048-def9-2f47ac835675/mzaf_7291874581203092560.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/3b/92/c7/3b92c7e4-92eb-dd0f-68d5-b8b5bd357ec6/075679875136.jpg/300x300bb.jpg"
  },
  {
    "name": "Rolling in the Deep",
    "artist": "Adele",
    "path": "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview125/v4/9f/07/1d/9f071dc7-791c-c869-dfa2-06b25936a287/mzaf_11077490630806345321.plus.aac.p.m4a",
    "cover": "https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/eb/ca/25/ebca2596-cd1e-b295-91a3-771c868d0a79/191404113868.png/300x300bb.jpg"
  }
];

let songIndex = 0;
let isRepeat = false;
let isShuffle = false;

// ================================
// Build Playlist UI
// ================================
function buildPlaylist() {
    playlistEl.innerHTML = '';
    songs.forEach((song, i) => {
        const li = document.createElement('li');
        li.className = i === songIndex ? 'active' : '';
        li.innerHTML = `
            <span class="song-index">${String(i + 1).padStart(2, '0')}</span>
            <div class="song-details">
                <div class="song-name">${song.name}</div>
                <div class="song-artist">${song.artist}</div>
            </div>
            <div class="playing-indicator">
                <span></span><span></span><span></span>
            </div>
        `;
        li.addEventListener('click', () => {
            songIndex = i;
            loadSong(songs[songIndex]);
            playSong();
            updatePlaylistActive();
        });
        playlistEl.appendChild(li);
    });
}

function updatePlaylistActive() {
    const items = playlistEl.querySelectorAll('li');
    items.forEach((li, i) => {
        li.classList.toggle('active', i === songIndex);
    });
}

// Toggle playlist open/close
playlistToggle.addEventListener('click', () => {
    playlistEl.classList.toggle('open');
    playlistArrow.classList.toggle('open');
});

// ================================
// Initialize
// ================================
loadSong(songs[songIndex]);
buildPlaylist();

function loadSong(song) {
    titleEl.innerText = song.name;
    artistEl.innerText = song.artist;
    audio.src = song.path;
    cover.src = song.cover;
}

// ================================
// Play / Pause
// ================================
function playSong() {
    audio.play();
    playIcon.className = 'fas fa-pause';
    albumArt.classList.add('playing');
    albumGlow.classList.add('active');
    playBtn.classList.add('is-playing');
    updatePlaylistActive();
}

function pauseSong() {
    audio.pause();
    playIcon.className = 'fas fa-play';
    albumArt.classList.remove('playing');
    albumGlow.classList.remove('active');
    playBtn.classList.remove('is-playing');
}

playBtn.addEventListener('click', () => {
    if (!audio.paused) {
        pauseSong();
    } else {
        playSong();
    }
});

// ================================
// Previous / Next
// ================================
function prevSong() {
    songIndex--;
    if (songIndex < 0) songIndex = songs.length - 1;
    loadSong(songs[songIndex]);
    playSong();
}

function nextSong() {
    if (isShuffle) {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * songs.length);
        } while (newIndex === songIndex && songs.length > 1);
        songIndex = newIndex;
    } else {
        songIndex++;
        if (songIndex > songs.length - 1) songIndex = 0;
    }
    loadSong(songs[songIndex]);
    playSong();
}

prevBtn.addEventListener('click', prevSong);
nextBtn.addEventListener('click', nextSong);

// ================================
// Shuffle & Repeat
// ================================
shuffleBtn.addEventListener('click', () => {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle('active', isShuffle);
});

repeatBtn.addEventListener('click', () => {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle('active', isRepeat);
});

audio.addEventListener('ended', () => {
    if (isRepeat) {
        audio.currentTime = 0;
        playSong();
    } else {
        nextSong();
    }
});

// ================================
// Progress Bar
// ================================
function updateProgress(e) {
    const { duration, currentTime } = e.srcElement;

    if (duration) {
        const pct = (currentTime / duration) * 100;
        progress.style.width = `${pct}%`;
        progressThumb.style.left = `${pct}%`;
    }

    if (duration) {
        const dm = Math.floor(duration / 60);
        let ds = Math.floor(duration % 60);
        if (ds < 10) ds = `0${ds}`;
        durationEl.textContent = `${dm}:${ds}`;
    }

    const cm = Math.floor(currentTime / 60);
    let cs = Math.floor(currentTime % 60);
    if (cs < 10) cs = `0${cs}`;
    currentTimeEl.textContent = `${cm}:${cs}`;
}

function setProgress(e) {
    const width = progressContainer.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;
    if (duration) audio.currentTime = (clickX / width) * duration;
}

audio.addEventListener('timeupdate', updateProgress);
progressContainer.addEventListener('click', setProgress);

audio.addEventListener('loadedmetadata', () => {
    const dm = Math.floor(audio.duration / 60);
    let ds = Math.floor(audio.duration % 60);
    if (ds < 10) ds = `0${ds}`;
    durationEl.textContent = `${dm}:${ds}`;
});

// ================================
// Volume
// ================================

// Visually fill the slider track with a gradient
function updateVolumeSliderFill() {
    const pct = volumeSlider.value * 100;
    volumeSlider.style.background = `linear-gradient(to right, #6366f1 0%, #a855f7 ${pct}%, rgba(255,255,255,0.07) ${pct}%)`;
}

volumeSlider.addEventListener('input', (e) => {
    audio.volume = e.target.value;
    updateMuteIcon();
    updateVolumeSliderFill();
});

muteBtn.addEventListener('click', () => {
    if (audio.volume > 0) {
        audio.dataset.savedVolume = audio.volume;
        audio.volume = 0;
        volumeSlider.value = 0;
    } else {
        audio.volume = audio.dataset.savedVolume || 0.5;
        volumeSlider.value = audio.volume;
    }
    updateMuteIcon();
    updateVolumeSliderFill();
});

function updateMuteIcon() {
    if (audio.volume === 0) {
        muteIcon.className = 'fas fa-volume-xmark';
    } else if (audio.volume < 0.5) {
        muteIcon.className = 'fas fa-volume-low';
    } else {
        muteIcon.className = 'fas fa-volume-high';
    }
}

// Set initial volume fill on page load
updateVolumeSliderFill();

// ================================
// Particle Background
// ================================
(function initParticles() {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 55;
    const colors = [
        [99, 102, 241],   // indigo
        [168, 85, 247],   // violet
        [236, 72, 153],   // pink
        [34, 211, 238],   // cyan
        [251, 191, 36]    // amber
    ];

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.35;
            this.speedY = (Math.random() - 0.5) * 0.35;
            this.opacity = Math.random() * 0.35 + 0.08;
            this.fadeDir = Math.random() > 0.5 ? 1 : -1;
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.opacity += this.fadeDir * 0.0015;
            if (this.opacity <= 0.05 || this.opacity >= 0.45) this.fadeDir *= -1;
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function connectParticles() {
        for (let a = 0; a < particles.length; a++) {
            for (let b = a + 1; b < particles.length; b++) {
                const dx = particles[a].x - particles[b].x;
                const dy = particles[a].y - particles[b].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    const c = particles[a].color;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${0.04 * (1 - dist / 110)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
})();
