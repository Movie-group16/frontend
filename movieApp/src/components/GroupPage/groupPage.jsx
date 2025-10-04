import { useLocation } from 'react-router-dom'
import './groupPage.css'
import { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'

const GroupPage = ( {token} ) => {

    const url = 'http://localhost:3001'
    const userId = localStorage.getItem('userId')

    const location = useLocation()
    const groupId = location.pathname.split("/").pop()

    const [groupDetails, setGroupDetails] = useState({})

    useEffect(() => {
        
    }, [])

    return (
        <div className='groupPage'>
            <h1>Group page</h1>
        </div>
    )
}

export default GroupPage