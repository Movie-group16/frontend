import React, { useState } from 'react'
import './showtimesPage.css'

function ShowtimesPage() {
  const [area, setArea] = useState('')
  const [dt, setDt] = useState('')
  const [eventID, setEventID] = useState('')
  const [showsData, setShowsData] = useState([])

  React.useEffect(() => {
    const today = new Date().toISOString().split('T')[0]
    setDt(today)
    // Wait for dt to be set, then fetch today's shows
    setTimeout(() => {
      document.querySelector('.showtimes-filter-bar button[type="submit"]')?.click()
    }, 0)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    let formattedDt = dt
    if (/^\d{4}-\d{2}-\d{2}$/.test(dt)) {
      const [year, month, day] = dt.split('-')
      formattedDt = `${day}.${month}.${year}`
    }
    const url = `https://www.finnkino.fi/xml/Schedule/?area=${area}&dt=${formattedDt}&eventID=${eventID}`
    try {
      const response = await fetch(url)
      const xmlText = await response.text()
      const parser = new window.DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, "text/xml")
      const shows = Array.from(xmlDoc.getElementsByTagName("Show"))
      let data = shows.map(show => ({
        title: show.querySelector('Title')?.innerHTML || "(No title)",
        dttmShowStart: show.querySelector('dttmShowStart')?.innerHTML || "",
        dttmShowEnd: show.querySelector('dttmShowEnd')?.innerHTML || "",
        lengthInMinutes: show.querySelector('LengthInMinutes')?.innerHTML || "",
        theatre: show.querySelector('Theatre')?.innerHTML || "",
        theatreAuditorium: show.querySelector('TheatreAuditorium')?.innerHTML || "",
        spokenLanguage: show.querySelector('SpokenLanguage > Name')?.innerHTML || "",
        subtitle1: show.querySelector('SubtitleLanguage1 > Name')?.innerHTML || "",
        subtitle2: show.querySelector('SubtitleLanguage2 > Name')?.innerHTML || "",
        image: show.querySelector('Images > EventSmallImagePortrait')?.innerHTML || "",
      }))
      if (eventID.trim()) {
        data = data.filter(show =>
          show.title.toLowerCase().includes(eventID.trim().toLowerCase())
        )
      }
      setShowsData(data)
    } catch (err) {
      console.error("Error fetching Finnkino data:", err)
      setShowsData([])
    }
}
  return (
    <div>
      <div>
        <h2 className="showtimes-title">Showtimes</h2>
        <form className="showtimes-filter-bar" onSubmit={handleSubmit}>
          <select
            value={area}
            onChange={e => setArea(e.target.value)}
          >
            <option value="">Select Area</option>
            {/* ...area options... */}
            <option value="1029">Kaikki</option>
            <option value="1014">Pääkaupunkiseutu</option>
            <option value="1002">Helsinki</option>
            <option value="1045">Helsinki: ITIS</option>
            <option value="1031">Helsinki: KINOPALATSI</option>
            <option value="1032">Helsinki: MAXIM</option>
            <option value="1033">Helsinki: TENNISPALATSI</option>
            <option value="1013">Vantaa: FLAMINGO</option>
            <option value="1015">Jyväskylä: FANTASIA</option>
            <option value="1016">Kuopio: SCALA</option>
            <option value="1017">Lahti: KUVAPALATSI</option>
            <option value="1041">Lappeenranta: STRAND</option>
            <option value="1018">Oulu: PLAZA</option>
            <option value="1019">Pori: PROMENADI</option>
            <option value="1021">Tampere</option>
            <option value="1034">Tampere: CINE ATLAS</option>
            <option value="1035">Tampere: PLEVNA</option>
            <option value="1047">Turku ja Raisio</option>
            <option value="1022">Turku: KINOPALATSI</option>
            <option value="1046">Raisio: LUXE MYLLY</option>
          </select>
          <input
            type="date"
            value={dt}
            onChange={e => setDt(e.target.value)}
          />
          <input
            type="text"
            value={eventID}
            onChange={e => setEventID(e.target.value)}
            placeholder="Type movie name"
          />
          <button type="submit">Search</button>
        </form>
        <div className="showtimes-list-container">
          {showsData.length === 0 ? (
            <div style={{ color: "#fff", textAlign: "center", fontSize: "1.3em" }}>
              No showtimes found with the seach criteria.
            </div>
          ) : (
            <ul className="showtimes-list">
            {showsData.map((show, idx) => {
              // Format date and time
              const start = new Date(show.dttmShowStart)
              const end = new Date(show.dttmShowEnd)
              const dateStr = `${start.getDate()}.${start.getMonth()+1}.${start.getFullYear()}`
              const startTime = `${String(start.getHours()).padStart(2, '0')}.${String(start.getMinutes()).padStart(2, '0')}`
              const endTime = `${String(end.getHours()).padStart(2, '0')}.${String(end.getMinutes()).padStart(2, '0')}`

              return (
                <li key={idx} className="showtime-row">
                  <div className="showtime-left">
                    <div className="showtime-date">{dateStr}</div>
                    <div className="showtime-time">{startTime} - {endTime}</div>
                    <div className="showtime-length">{show.lengthInMinutes} min</div>
                  </div>
                  <div className="showtime-details">
                    <h3 className="showtime-title">{show.title}</h3>
                    <div className="text-gray">{show.theatre}</div>
                    <div className="text-gray">{show.theatreAuditorium}</div>
                    <div className="text-gray">
                      Language: {show.spokenLanguage}
                      {' │ Subtitles: '}
                      {[show.subtitle1, show.subtitle2].filter(Boolean).join(', ') || 'None'}
                    </div>
                  </div>
                  <div className="showtime-image">
                    {show.image && <img src={show.image} alt={show.title} />}
                  </div>
                </li>
              )
            })}
          </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShowtimesPage