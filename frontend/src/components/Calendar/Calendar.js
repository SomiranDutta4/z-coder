import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Calendar.css';

function EventCalendar({ events }) {
    const [selectedDate, setSelectedDate] = useState(new Date());

    const onDateChange = (date) => {
        setSelectedDate(date);
    };

    return (
        <div className='calendar-home'>
            <div className="calendar-container">
                <Calendar
                    onChange={onDateChange}
                    value={selectedDate}
                    tileContent={({ date }) => {
                        const eventDates = events.map(event => {
                            const eventDate = new Date(event.startTimeSeconds * 1000);
                            return eventDate.toDateString();
                        });
                        return eventDates.includes(date.toDateString()) ? <div className="event-dot"></div> : null;
                    }}
                />
                <div className="event-list">
                    {
                        events.filter(event => {
                            const eventDate = new Date(event.startTimeSeconds * 1000);
                            return eventDate.toDateString() === selectedDate.toDateString();
                        }).length > 0

                            ? (events.filter(event => {
                                const eventDate = new Date(event.startTimeSeconds * 1000);
                                return eventDate.toDateString() === selectedDate.toDateString();
                            }).map(filteredEvent => (
                                <div key={filteredEvent.id} className="event-item">
                                    <h3>{filteredEvent.name}</h3>
                                    <p>{new Date(filteredEvent.startTimeSeconds * 1000).toLocaleString()}</p>
                                    <p>{filteredEvent.type}</p>
                                </div>
                            ))) : (<div className='event-item'><p>No events on this date</p></div>)
                    }
                </div>
            </div>
        </div>

    );
}

export default EventCalendar;
