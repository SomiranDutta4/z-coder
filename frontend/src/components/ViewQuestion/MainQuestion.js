import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HistoryIcon from '@mui/icons-material/History';
import { Avatar } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './mainquestion.css';
import axios from 'axios';
import ReactHtmlParser from 'html-react-parser';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';

function MainQuestion() {
    const [show, setShow] = useState(false);
    const [questionData, setQuestionData] = useState();
    const [answer, setAnswer] = useState("");
    const [comment, setComment] = useState('');
    const user = useSelector(selectUser);

    let search = window.location.search;
    const params = new URLSearchParams(search);
    const id = params.get("q");

    const handleQuill = (value) => {
        setAnswer(value);
    }

    useEffect(() => {
        async function getQuestionDetails() {
            await axios.get(`/api/question/${id}`).then((res) => {
                console.log(res.data[0]);
                setQuestionData(res.data[0]);
            }).catch((e) => {
                console.log(e);
                alert("Error in retrieving the question");
            })
        }

        getQuestionDetails();
    }, [id]);


    async function getUpdatedAnswer() {
        await axios.get(`/api/question/${id}`).then((res) => {
            console.log(res.data[0]);
            setQuestionData(res.data[0]);
        }).catch((e) => {
            console.log(e);
            alert("Error in retrieving the question");
        })
    }


    const modules = {
        toolbar: [
            [{ 'font': [] }],
            [{ 'header': [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }, { 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
        ],
    };

    const parseHtml = (htmlString) => {
        if (typeof htmlString === 'string') {
            return ReactHtmlParser(htmlString);
        } else {
            console.error('Invalid HTML string:', htmlString);
            return null;
        }
    };

    const handleSubmit = async () => {
        if (answer !== "") {
            const body = {
                question_id: id,
                answer: answer,
                user: user
            }

            const config = {
                headers: {
                    "Content-Type": "application/json"
                }
            }

            await axios.post('/api/answer', body, config).then((res) => {
                console.log(res.data);
                setAnswer("");
                getUpdatedAnswer();
            })
                .catch((e) => {
                    console.log(e);
                    alert('Error in adding the answer');
                    setAnswer("");
                })

        }
    }

    const handleComment = async () => {
        if (comment !== "") {
            const body = {
                question_id: id,
                comment: comment,
                user: user
            }

            await axios.post(`/api/comment/${id}`, body).then((res) => {
                console.log(res.data);
                setComment("");
                setShow(false);
                getUpdatedAnswer();
            }).catch((e) => {
                console.log(e);
                alert("Error in adding comment");
                setComment("");
            })
        }
    }

    return (
        <div className='main'>
            <div className='main-container'>
                <div className='main-top'>
                    <h2 className='main-question'>{questionData?.title}</h2>
                    <Link to='/add-question'><button className='ask-button'>Ask Question</button></Link>
                </div>
                <div className='main-desc'>
                    <div className='info'>
                        <p>{new Date(questionData?.created_at).toLocaleString()}</p>
                        <p>Active<span>today</span></p>
                    </div>
                </div>
                <div className='all-questions'>
                    <div className='all-questions-container'>
                        <div className='all-questions-left'>
                            <div className='all-options'>
                                <KeyboardDoubleArrowUpIcon className='arrow' />
                                <p className='count'>0</p>
                                <KeyboardDoubleArrowDownIcon className='arrow' />
                                <BookmarkIcon />
                                <HistoryIcon />
                            </div>
                        </div>

                        <div className='question-answer'>
                            <p>{parseHtml(questionData?.body)}</p>
                            <div className='author'>
                                <small>asked {new Date(questionData?.created_at).toLocaleString()}</small>
                                <div className='auth-details'>
                                    <Avatar src={questionData?.user?.photo} />
                                    <p>{questionData?.user?.displayName ?
                                        questionData?.user?.displayName : String(questionData?.user?.email).split('@')[0]}</p>
                                </div>
                            </div>
                            <div className='comments'>
                                <div className='comment'>
                                    {
                                        questionData?.comments && questionData?.comments?.map((_qd) => (
                                            <p>{_qd?.comment} - {" "}<span>{_qd?.user?.displayName ?
                                                _qd?.user?.displayName : String(_qd?.user?.email).split('@')[0]}</span>
                                                <small>  {new Date(_qd?.created_at).toLocaleString()}</small></p>
                                        ))
                                    }
                                </div>
                                <p onClick={() => setShow(!show)}>Add a comment</p>
                                {
                                    show && (<div className='title'>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => { setComment(e.target.value) }}
                                            type="text"
                                            placeholder='Add your comment'
                                            rows={5} style={{
                                                margin: "5px 0px",
                                                padding: "10px",
                                                border: "1px solid rgba(0,0,0,0.2)",
                                                borderRadius: "3px",
                                                outline: "none",
                                            }}
                                        ></textarea>
                                        <button
                                            onClick={handleComment}
                                            style={{
                                                maxWidth: "fit-content"
                                            }}
                                        >Add comment</button>
                                    </div>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='all-questions' style={{
                    flexDirection: 'column'
                }}>
                    <p style={{
                        marginBottom: '20px',
                        fontSize: '1.3rem',
                        fontWeight: "300"
                    }}>
                        {questionData?.answerDetails?.length} Answers
                    </p>
                    {
                        questionData?.answerDetails?.map((_q) => (
                            <div key={_q?._id} className='all-questions-container'>
                                <div className='all-questions-left'>
                                    <div className='all-options'>
                                        <KeyboardDoubleArrowUpIcon className='arrow' />
                                        <p className='count'>0</p>
                                        <KeyboardDoubleArrowDownIcon className='arrow' />
                                        <BookmarkIcon />
                                        <HistoryIcon />
                                    </div>
                                </div>
                                <div className='question-answer'>
                                    <p>{parseHtml(_q?.answer)}</p>
                                    <div className='author'>
                                        <small>uploaded on {new Date(_q?.created_at).toLocaleString()}</small>
                                        <div className='auth-details'>
                                            <Avatar src={_q?.user?.photo} />
                                            <p>{_q?.user?.displayName ?
                                                _q?.user?.displayName : String(_q?.user?.email).split('@')[0]}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            <div className='main-answer'>
                <h3 style={{
                    fontSize: '22px',
                    margin: '10px 0',
                    fontWeight: '400',
                }}
                >Your Answer</h3>
                <ReactQuill
                    value={answer}
                    onChange={handleQuill}
                    className='react-quill'
                    theme='snow'
                    modules={modules}
                    style={{
                        border: "1px solid white"
                    }}
                />
                <button
                    type='submit'
                    onClick={handleSubmit}
                    style={{
                        maxWidth: "fit-content",
                        marginTop: '5px'
                    }}>Post Your Answer</button>
            </div>

        </div>
    )
}

export default MainQuestion;
