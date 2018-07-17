const loadedTracks = [];
let track;

const playFile = file => {
  if (track) {
    track.stop();
  }
  const loaded = loadedTracks.find(t => t.file === file);
  if (!loaded) {
    track = new Howl({
      src: [`audio/${file}`],
      html5: true,
      autoplay: true,
      onplay: () => {
        setDuration();
        requestAnimationFrame(setTime);
      },
    });
    loadedTracks.push({ file, track });
  } else {
    track = loaded.track;
    track.play();
  }

  document.getElementById('currentTrack').innerHTML = file;
};

const setDuration = () => {
  const duration = track.duration();
  document.getElementById('currentTrackDuration').innerHTML = `${Math.round(
    duration / 60,
  )
    .toString()
    .padStart(2, '0')}:${Math.round(duration % 60)
    .toString()
    .padStart(2, '0')}`;
};

const setTime = () => {
  const seek = track.seek() || 0;
  document.getElementById('currentTrackTime').innerHTML = `${Math.round(
    seek / 60,
  )
    .toString()
    .padStart(2, '0')}:${Math.round(seek % 60)
    .toString()
    .padStart(2, '0')}`;

  if (track.playing()) {
    requestAnimationFrame(setTime);
  }
};

const playCurrent = () => {
  if (track && !track.playing()) {
    track.play();
  } else if (track) {
    track.pause();
  }
};

const stopCurrent = () => {
  if (track) {
    track.stop();
  }
};
