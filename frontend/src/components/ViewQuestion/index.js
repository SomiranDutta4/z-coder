import React from 'react'
import '../Main/index.css'
import Sidebar from '../Main/Sidebar'
import MainQuestion from './MainQuestion'


function index() {
    return (
        <div className='stack-index'>
            <div className='stack-index-content'>
                <Sidebar />
                <MainQuestion />
            </div>
        </div>
    )
}

export default index