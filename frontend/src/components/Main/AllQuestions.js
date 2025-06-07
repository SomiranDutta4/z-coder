import { Avatar } from '@mui/material'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ReactHtmlParser from 'html-react-parser'
import axios from 'axios'

function AllQuestions({ question, currentUserId }) {
  const navigate = useNavigate()

  const tags = JSON.parse(question?.tags[0] || '[]')
  const [voteCount, setVoteCount] = useState(
    Math.max(0, Object.values(question.votes || {}).reduce((sum, val) => sum + val, 0))
  )

  const handleVote = async (type) => {
    try {
      const res = await axios.post(process.env.REACT_APP_backendUrl + `/api/question/${question._id}/vote`, {
        userId: currentUserId,
        voteType: type,
      })
      setVoteCount(res.data.totalVotes)
    } catch (err) {
      console.error('Voting error:', err)
    }
  }

  function truncate(str, n) {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str
  }

  return (
    <div className="w-full p-5 bg-gray-900 rounded-xl shadow-lg mb-5 border border-gray-700 hover:border-blue-600 transition">
      <div className="flex justify-between w-full">
        {/* Voting Section */}
        <div className="flex flex-col items-center mr-8 text-gray-400 text-sm font-semibold select-none">
          <button
            onClick={() => handleVote(1)}
            className="hover:text-green-400 transition-colors"
            aria-label="Upvote"
          >
            ▲
          </button>
          <p className="text-xl font-bold my-1 text-white">{voteCount}</p>
          <button
            onClick={() => handleVote(-1)}
            className="hover:text-red-400 transition-colors"
            aria-label="Downvote"
          >
            ▼
          </button>
          <p className="text-xs mt-1">Votes</p>

          {/* Answer count */}
          <div
            onClick={() => {
              navigate('/question?q=' + question?._id)
            }}
            className="cursor-pointer flex flex-col items-center mt-5 text-gray-400 hover:text-blue-500 transition-colors select-none"
            aria-label="View Answers"
          >
            <p className="text-xl font-bold text-white">{question?.answerDetails?.length}</p>
            <p>Answers</p>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 flex flex-col">
          <Link
            to={`/question?q=${question?._id}`}
            className="text-xl font-semibold text-blue-400 hover:underline mb-3 truncate"
          >
            {question?.title}
          </Link>

          <div className="text-gray-300 text-base mb-4 leading-relaxed max-h-40 overflow-hidden">
            {ReactHtmlParser(truncate(question?.body, 800))}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((_tag, index) => (
              <span
                key={index}
                className="bg-blue-800 text-blue-300 px-3 py-1 rounded-full text-sm select-none"
              >
                {_tag}
              </span>
            ))}
          </div>

          {/* Author Info */}
          <div className="flex items-center justify-end space-x-3 text-gray-400 text-xs">
            <div>{new Date(question?.created_at).toLocaleString()}</div>
            <div className="flex items-center space-x-2">
              <Avatar src={question?.user?.photo} sx={{ width: 28, height: 28 }} />
              <p className="text-sm text-white font-medium select-text">
                {question?.user?.displayName || String(question?.user?.email).split('@')[0]}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllQuestions
