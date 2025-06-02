import { Avatar } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import './allquestions.css';
import ReactHtmlParser from 'html-react-parser'

function AllQuestions({ question }) {

    const tags = JSON.parse(question?.tags[0]);

    function truncate(str, n) {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    }

    return (
        <div className='all-questions'>
            <div className='all-questions-container'>
                <div className='all-questions-left'>
                    <div className='all-options'>
                        <div className='all-option'>
                            <p>0</p>
                            <p>Votes</p>
                        </div>
                        <div className='all-option'>
                            <p>{question?.answerDetails?.length}</p>
                            <p>Answers</p>
                        </div>
                    </div>
                </div>
                <div className='question-answer'>
                    <Link to={`/question?q=${question?._id}`}>{question?.title}</Link>
                    <div style={{
                        width: "90%"
                    }}>
                        <div style={{ fontSize: '18px' }}>{ReactHtmlParser(truncate(question?.body, 800))}</div>
                    </div>
                    <div style={{
                        display: "flex"
                    }}>
                        {
                            tags.map((_tag) => (
                                <>

                                    <span className='question-tags'>
                                        {_tag}
                                    </span>

                                </>
                            ))
                        }
                    </div>

                    <div className='author'>
                        <small>{new Date(question?.created_at).toLocaleString()}</small>
                        <div className='author-details'>
                            <Avatar src={question?.user?.photo} />
                            <p>{question?.user?.displayName ?
                                question?.user?.displayName : String(question?.user?.email).split('@')[0]}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AllQuestions