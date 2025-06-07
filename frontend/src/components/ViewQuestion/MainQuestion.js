import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import HistoryIcon from '@mui/icons-material/History';
import { Avatar } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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
    const id = new URLSearchParams(window.location.search).get("q");

    const [questionVotesCount, setQuestionVotesCount] = useState(0);
    const [answersVotesCount, setAnswersVotesCount] = useState({});

    const fetchQuestion = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_backendUrl}/api/question/${id}`);
            const question = res.data[0];
            setQuestionData(question);

            const qVotes = question.votes ? Object.values(question.votes).reduce((sum, val) => sum + val, 0) : 0;
            setQuestionVotesCount(Math.max(0, qVotes));

            let ansVotesCount = {};
            question.answerDetails?.forEach(ans => {
                const votes = ans.votes ? Object.values(ans.votes).reduce((sum, val) => sum + val, 0) : 0;
                ansVotesCount[ans._id] = Math.max(0, votes);
            });
            setAnswersVotesCount(ansVotesCount);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchQuestion();
    }, [id]);

    const handleQuill = (value) => setAnswer(value);

    const handleSubmit = async () => {
        if (!answer) return;
        try {
            await axios.post(`${process.env.REACT_APP_backendUrl}/api/answer`, {
                question_id: id,
                answer,
                user
            }, {
                headers: { "Content-Type": "application/json" }
            });
            setAnswer("");
            fetchQuestion();
        } catch (err) {
            console.log(err);
        }
    };

    const handleComment = async () => {
        if (!comment) return;
        try {
            await axios.post(`${process.env.REACT_APP_backendUrl}/api/comment/${id}`, {
                question_id: id,
                comment,
                user
            });
            setComment("");
            setShow(false);
            fetchQuestion();
        } catch (err) {
            alert("Error posting comment");
        }
    };

    const handleQuestionVote = async (voteType) => {
        if (!user?.uid) {
            alert("Please login to vote");
            return;
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_backendUrl}/api/question/${id}/vote`, {
                userId: user.uid,
                voteType,
            });
            setQuestionVotesCount(res.data.totalVotes);
        } catch (err) {
            console.error('Voting error:', err);
        }
    };

    const handleAnswerVote = async (answerId, type) => {
        if (!user?.uid) {
            alert("Please login to vote");
            return;
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_backendUrl}/api/answer/vote`, {
                questionId: id,
                answerId,
                userId: user?.uid,
                voteType: type
            });

            setAnswersVotesCount((prev) => ({
                ...prev,
                [answerId]: res.data.totalVotes
            }));
        } catch (err) {
            alert("Error voting answer");
        }
    };

    const parseHtml = (html) => (typeof html === 'string' ? ReactHtmlParser(html) : null);

    return (
        <div className="h-full bg-[#1e1e2f] text-white px-6 py-10">
            <div className="max-w-5xl mx-auto space-y-10">
                {/* Title and Vote */}
                <div className="flex flex-col sm:flex-row justify-between gap-6 sm:items-center">
                    <h2 className="text-3xl font-bold flex-1">{questionData?.title}</h2>
                    <Link to="/add-question">
                        <button className="bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg text-sm font-medium">
                            Ask Question
                        </button>
                    </Link>
                </div>

                {/* Metadata */}
                <div className="text-sm text-gray-400 flex gap-4">
                    <p>{new Date(questionData?.created_at).toLocaleString()}</p>
                    <p>Active <span className="text-green-400">today</span></p>
                </div>

                {/* Question Box */}
                <div className="bg-[#262636] rounded-lg p-6 flex gap-6 border border-gray-700">
                    <div className="flex flex-col items-center text-gray-400">
                        <KeyboardDoubleArrowUpIcon
                            onClick={() => handleQuestionVote(1)}
                            className="cursor-pointer hover:text-green-400"
                        />
                        <span className="font-bold">{questionVotesCount}</span>
                        <KeyboardDoubleArrowDownIcon
                            onClick={() => handleQuestionVote(-1)}
                            className="cursor-pointer hover:text-red-400"
                        />
                        <BookmarkIcon className="mt-3" />
                        <HistoryIcon className="mt-2" />
                    </div>

                    <div className="flex-1 space-y-4">
                        <div className="prose prose-invert max-w-none">{parseHtml(questionData?.body)}</div>

                        <div className="flex justify-between text-xs text-gray-400 pt-2 border-t border-gray-700">
                            <span>asked on {new Date(questionData?.created_at).toLocaleString()}</span>
                            <div className="flex items-center gap-2">
                                <Avatar src={questionData?.user?.photo} className="w-6 h-6" />
                                <span>{questionData?.user?.displayName || questionData?.user?.email?.split('@')[0]}</span>
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            {questionData?.comments?.map((c, idx) => (
                                <p key={idx} className="text-gray-400">
                                    {c.comment} –{" "}
                                    <span className="text-white font-medium">
                                        {c.user?.displayName || c.user?.email?.split('@')[0]}
                                    </span>{" "}
                                    <small className="text-xs">{new Date(c.created_at).toLocaleString()}</small>
                                </p>
                            ))}
                            <p onClick={() => setShow(!show)} className="text-indigo-400 cursor-pointer text-sm font-medium">
                                {show ? "Cancel" : "Add a comment"}
                            </p>

                            {show && (
                                <div className="space-y-3">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows="3"
                                        className="w-full bg-transparent border border-gray-600 rounded-md p-2 text-sm focus:outline-none"
                                        placeholder="Add your comment"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleComment}
                                            className="bg-indigo-600 px-3 py-1 text-sm rounded hover:bg-indigo-700"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setComment("");
                                                setShow(false);
                                            }}
                                            className="bg-gray-600 px-3 py-1 text-sm rounded hover:bg-gray-700"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Answers */}
                <div className="space-y-6">
                    <h3 className="text-2xl font-semibold">{questionData?.answerDetails?.length || 0} Answers</h3>

                    {questionData?.answerDetails?.map((ans) => (
                        <div key={ans._id} className="bg-[#20202c] border border-gray-700 rounded-lg p-5 flex gap-6">
                            <div className="flex flex-col items-center text-gray-400">
                                <KeyboardDoubleArrowUpIcon
                                    className="cursor-pointer hover:text-green-400"
                                    onClick={() => handleAnswerVote(ans._id, 1)}
                                />
                                <span className="font-bold">{answersVotesCount[ans._id] || 0}</span>
                                <KeyboardDoubleArrowDownIcon
                                    className="cursor-pointer hover:text-red-400"
                                    onClick={() => handleAnswerVote(ans._id, -1)}
                                />
                                <BookmarkIcon className="mt-3" />
                                <HistoryIcon className="mt-2" />
                            </div>
                            <div className="flex-1 space-y-3">
                                <div className="prose prose-invert max-w-none">{parseHtml(ans.answer)}</div>
                                <div className="flex justify-between text-xs text-gray-400 border-t pt-2 border-gray-700">
                                    <span>answered on {new Date(ans.created_at).toLocaleString()}</span>
                                    <div className="flex items-center gap-2">
                                        <Avatar src={ans?.user?.photo} className="w-6 h-6" />
                                        <span>{ans?.user?.displayName || ans?.user?.email?.split('@')[0]}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Your Answer */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold">Your Answer</h3>
                    <ReactQuill
                        value={answer}
                        onChange={handleQuill}
                        theme="snow"
                        className="bg-white rounded-md"
                        style={{
                            color: '#000',
                            minHeight: '150px',
                            padding: '6px 8px',
                            fontSize: '16px',
                            boxShadow: '0 0 5px rgba(0,0,0,0.1)',
                        }}
                    />
                    <button
                        onClick={handleSubmit}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium"
                    >
                        Post Your Answer
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MainQuestion;
