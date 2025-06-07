import { Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactHtmlParser from 'html-react-parser'
import axios from 'axios'

function AllQuestions({ question, currentUserId }) {

    const tags = JSON.parse(question?.tags[0] || '[]');
    const [voteCount, setVoteCount] = useState(
        Math.max(0, Object.values(question.votes || {}).reduce((sum, val) => sum + val, 0))
    );

    const handleVote = async (type) => {
        try {
            const res = await axios.post(process.env.REACT_APP_backendUrl + `/api/question/${question._id}/vote`, {
                userId: currentUserId,
                voteType: type,
            });
            setVoteCount(res.data.totalVotes);
        } catch (err) {
            console.error('Voting error:', err);
        }
    };

    function truncate(str, n) {
        return str?.length > n ? str.substr(0, n - 1) + "..." : str;
    }

    return (
        <div className="w-full p-5 bg-white rounded-xl shadow-sm mb-4">
            <div className="flex justify-between w-full">
                {/* Voting Section */}
                <div className="flex flex-col items-center mr-8 text-gray-600 text-sm font-medium">
                    <button
                        onClick={() => handleVote(1)}
                        className="hover:text-green-600 transition"
                    >
                        ▲
                    </button>
                    <p className="text-lg font-semibold my-1">{voteCount}</p>
                    <button
                        onClick={() => handleVote(-1)}
                        className="hover:text-red-600 transition"
                    >
                        ▼
                    </button>
                    <p className="text-xs mt-1">Votes</p>

                    {/* Answer count */}
                    <div className="flex flex-col items-center mt-4">
                        <p className="text-lg font-semibold">{question?.answerDetails?.length}</p>
                        <p>Answers</p>
                    </div>
                </div>

                {/* Question Content */}
                <div className="flex-1 flex flex-col">
                    <Link
                        to={`/question?q=${question?._id}`}
                        className="text-lg font-semibold text-blue-700 hover:underline mb-2"
                    >
                        {question?.title}
                    </Link>

                    <div className="text-gray-700 text-base mb-3">
                        {ReactHtmlParser(truncate(question?.body, 800))}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                        {tags.map((_tag, index) => (
                            <span
                                key={index}
                                className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                            >
                                {_tag}
                            </span>
                        ))}
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center justify-end space-x-2">
                        <div className="text-xs text-gray-500">
                            {new Date(question?.created_at).toLocaleString()}
                        </div>
                        <div className="flex items-center space-x-2">
                            <Avatar src={question?.user?.photo} sx={{ width: 24, height: 24 }} />
                            <p className="text-sm text-gray-800 font-medium">
                                {question?.user?.displayName || String(question?.user?.email).split('@')[0]}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AllQuestions;
