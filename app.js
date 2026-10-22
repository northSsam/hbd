const musicButton = document.querySelector("#musicButton");
const musicNote = document.querySelector("#musicNote");
const gallery = document.querySelector("#gallery");
const galleryPrev = document.querySelector("#prev");
const galleryNext = document.querySelector("#next");
const heartButton = document.querySelector("#heartButton");
const toast = document.querySelector("#toast");

let audioContext;
let scheduledNotes = [];
let stopTimer;

const birthdayMelody = [
[392, 0.4], [392, 0.4], [440, 0.8], [392, 0.8],
[523.25, 0.8], [493.88, 1.4],
[392, 0.4], [392, 0.4], [440, 0.8], [392, 0.8],
[587.33, 0.8], [523.25, 1.4],
[392, 0.4], [392, 0.4], [783.99, 0.8],
[659.25, 0.8], [523.25, 0.8], [493.88, 0.8], [440, 1.4],
[698.46, 0.4], [698.46, 0.4], [659.25, 0.8],
[523.25, 0.8], [587.33, 0.8], [523.25, 1.4]
];

function setMusicState(isPlaying, note = "") {
musicButton.setAttribute("aria-pressed", String(isPlaying));
musicButton.innerHTML = isPlaying
? '<span class="music-icon">♫</span> Hentikan lagu'
: '<span class="music-icon">♫</span> Putar lagu ulang tahun';


musicNote.textContent = note;


}

function stopMusic(note = "Satu lagu kecil untuk Ayah ♡") {
clearTimeout(stopTimer);


scheduledNotes.forEach((oscillator) => {
    try {
        oscillator.stop();
    } catch (error) {
        // Nada sudah berhenti.
    }
});

scheduledNotes = [];
setMusicState(false, note);


}

async function playBirthdaySong() {
if (!window.AudioContext) {
setMusicState(false, "Browser ini belum mendukung pemutar musik.");
return;
}


try {
    audioContext ??= new AudioContext();
    await audioContext.resume();

    const startAt = audioContext.currentTime + 0.08;
    let offset = 0;

    scheduledNotes = [];

    for (const [frequency, duration] of birthdayMelody) {
        const oscillator = audioContext.createOscillator();
        const volume = audioContext.createGain();

        const noteStart = startAt + offset;
        const noteEnd = noteStart + duration * 0.88;

        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(frequency, noteStart);

        volume.gain.setValueAtTime(0.0001, noteStart);
        volume.gain.exponentialRampToValueAtTime(0.13, noteStart + 0.025);
        volume.gain.setValueAtTime(0.13, noteEnd - 0.035);
        volume.gain.exponentialRampToValueAtTime(0.0001, noteEnd);

        oscillator.connect(volume);
        volume.connect(audioContext.destination);

        oscillator.start(noteStart);
        oscillator.stop(noteEnd + 0.02);

        scheduledNotes.push(oscillator);
        offset += duration;
    }

    setMusicState(true, "Semoga harinya penuh bahagia ♡");

    stopTimer = setTimeout(() => {
        stopMusic("Satu lagu kecil untuk Ayah ♡");
    }, offset * 1000);
} catch (error) {
    console.error("Musik gagal diputar:", error);
    setMusicState(false, "Musik belum bisa diputar. Coba lagi ya.");
}


}

musicButton.addEventListener("click", () => {
if (musicButton.getAttribute("aria-pressed") === "true") {
stopMusic("Lagu dijeda ♡");
} else {
void playBirthdaySong();
}
});

if (galleryPrev && gallery && galleryNext) {
galleryPrev.addEventListener("click", () => {
gallery.scrollBy({
left: -gallery.clientWidth * 0.8,
behavior: "smooth"
});
});


galleryNext.addEventListener("click", () => {
    gallery.scrollBy({
        left: gallery.clientWidth * 0.8,
        behavior: "smooth"
    });
});


}

if (heartButton && toast) {
heartButton.addEventListener("click", () => {
toast.classList.add("show");


    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
});

}
