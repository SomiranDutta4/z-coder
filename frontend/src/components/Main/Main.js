import React from 'react'
import { Link } from 'react-router-dom'
import FilterIcon from '@mui/icons-material/FilterList'
import AllQuestions from './AllQuestions'


function Main({ questions, currentUserId }) {
  return (
    <main className="flex-1 h-fit max-h-screen overflow-y-auto p-6 text-gray-300">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-medium">All Questions</h2>
          <Link to="/add-question">
            <button className="border border-gray-600 text-gray-300 px-3 py-1 rounded hover:bg-gray-700 transition">
              Ask Question
            </button>
          </Link>
        </div>

        {/* Description & Filters */}
        <div className="flex justify-between items-center mb-5 text-sm text-gray-400">
          <p>{questions?.length || 0} Questions</p>
          <div className="flex items-center space-x-5">
            <div className="flex space-x-6">
              <Link className="hover:underline cursor-pointer">Newest</Link>
              <Link className="hover:underline cursor-pointer">Active</Link>
              <Link className="hover:underline cursor-pointer">More</Link>
            </div>
            <div className="flex items-center space-x-1 cursor-pointer hover:underline">
              <FilterIcon fontSize="small" />
              <p>Filter</p>
            </div>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {questions && questions.length > 0 ? (
            questions.map((q, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded border border-gray-700 p-4"
              >
                <AllQuestions question={q} currentUserId={currentUserId} />
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No questions available.</p>
          )}
        </div>
      </div>
    </main>
  )
}

export default Main
