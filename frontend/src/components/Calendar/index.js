import React, { useState, useEffect } from 'react'
import EventCalendar from './Calendar'
import axios from 'axios';




function Index() {

    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function getEvents() {
            await axios.get('/api/contests/codeforces').then((res) => {
                console.log(res.data);
                setEvents(res.data.reverse());
            }).catch((err) => {
                console.log(err);
            })
        }
        getEvents();
    }, [])

    return (
        <div>
            <EventCalendar events={events} />
        </div>
    )
}

export default Index