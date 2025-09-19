import React, { useState } from 'react'
import './showtimesPage.css'

function ShowtimesPage() {
  const [area, setArea] = useState('')
  const [dt, setDt] = useState('')
  const [eventID, setEventID] = useState('')
  const [nrOfDays, setNrOfDays] = useState(1)
  const [movieTitles, setMovieTitles] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const url = `https://www.finnkino.fi/xml/Schedule/?area=${area}&dt=${dt}&eventID=${eventID}&nrOfDays=${nrOfDays}`
    try {
      const response = await fetch(url)
      const xmlText = await response.text()
      const parser = new window.DOMParser()
      const xmlDoc = parser.parseFromString(xmlText, "text/xml")
      const shows = Array.from(xmlDoc.getElementsByTagName("Show"))
      const titles = shows.map(show => {
        const titleNode = show.children[15]
        return titleNode ? titleNode.innerHTML : "(No title)"
      })
      setMovieTitles(titles) 
    } catch (err) {
      console.error("Error fetching Finnkino data:", err)
      setMovieTitles([])
    }
  }

  return (
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
          <option value="1012">Espoo</option>
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
          placeholder="Movie name"
        />
        <button type="submit">Search</button>
      </form>
      <div className="showtimes-list-container">
        <ul className="showtimes-list">
          {movieTitles.map((title, idx) => (
            <li key={idx}>{title}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default ShowtimesPage