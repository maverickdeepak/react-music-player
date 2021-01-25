import {useState, useRef} from 'react'
import './style/app.scss'
import Player from './components/Player'
import Song from './components/Song'
import Library from './components/Library'
import Nav from './components/Nav'

import data from './data'
function App() {
  const audioRef = useRef(null)
  const [songs, setSongs] = useState(data())
  const [currentSong, setCurrentSong] = useState(songs[0])
  const [isPlaying, setIsPlaying] = useState(false)
      // State
      const [songInfo, setSongInfo] = useState({
        currentTime: 0,
        duration: 0,
        animationPercentage: 0
    })
    const [libraryStatus, setLibraryStatus] = useState(false)
    // update timestamp of audio
    const timeUpdateHandler = (e) => {
      const current = e.target.currentTime
      const duration = e.target.duration
      // calculate percentage
      const rounderCurrent = Math.round(current)
      const rounderDuration = Math.round(duration)
      const animation = Math.round((rounderCurrent / rounderDuration) * 100)

      setSongInfo({...songInfo, currentTime:current, duration:duration, animationPercentage:animation})
  }
  const songEndHandler = async (e) => {
    let currentIndex = songs.findIndex((song) => song.id === currentSong.id)
    await setCurrentSong(songs[(currentIndex + 1) % songs.length])
    if(isPlaying) audioRef.current.play()
  }
  return (
    <div className={`App ${libraryStatus ? 'library-active' : ''}`}>
      <Nav libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} />
      <Song currentSong={currentSong} />
      <Player setSongs={setSongs} setCurrentSong={setCurrentSong} songs={songs} audioRef={audioRef} setIsPlaying={setIsPlaying} isPlaying={isPlaying} currentSong={currentSong} setSongInfo={setSongInfo} songInfo={songInfo} />
      <Library libraryStatus={libraryStatus} setLibraryStatus={setLibraryStatus} isPlaying={isPlaying} setSongs={setSongs} audioRef={audioRef} songs={songs} setCurrentSong={setCurrentSong} />
      <audio onTimeUpdate={timeUpdateHandler} onLoadedMetadata={timeUpdateHandler} ref={audioRef} src={currentSong.audio} onEnded={songEndHandler}></audio>
    </div>
  );
}

export default App;
