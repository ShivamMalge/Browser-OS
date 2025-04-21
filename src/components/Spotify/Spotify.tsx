"use client"

const Spotify = () => {
  return (
    <div className="h-full w-full bg-black">
      <iframe
        src="https://open.spotify.com/embed/playlist/37i9dQZEVXbLZ52XmnySJg"
        frameBorder="0"
        title="Spotify"
        className="h-full w-full bg-black"
        allow="encrypted-media"
      ></iframe>
    </div>
  )
}

export default Spotify
