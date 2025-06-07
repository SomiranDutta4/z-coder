import React, { useState, useEffect } from 'react';
import axios from 'axios';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';

function UserQuestions({ userId }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const viewQuestion = (quesId) => {
        navigate('/question?q=' + quesId);
    }

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${process.env.REACT_APP_backendUrl}/api/users/questions/${userId}`);
                setQuestions(res.data);
            } catch (err) {
                setError('Failed to load questions.');
            } finally {
                setLoading(false);
            }
        };
        if (userId) fetchQuestions();
    }, [userId]);

    return (
        <div className="w-full h-[91vh] flex justify-center items-start bg-[#111827] p-4">
            <div className="w-full max-w-4xl h-full bg-[#1e293b] p-6 rounded-md shadow-md text-gray-200 overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-slate-100">Your Questions</h2>
                </div>

                {loading && <p className="text-slate-400">Loading questions...</p>}
                {error && <p className="text-red-500">{error}</p>}

                {!loading && !error && questions?.length === 0 && (
                    <p className="text-slate-400">You haven't asked any questions yet.</p>
                )}

                <ul className="space-y-4 overflow-y-auto pr-2 h-[calc(91vh-96px)]">
                    {questions.map((q) => (
                        <div>
                            <li onClick={() => { viewQuestion(q._id) }}
                                key={q._id}
                                className="border border-slate-600 rounded p-4 hover:bg-[#273549] cursor-pointer transition"
                            >
                                <h3 className="text-lg font-medium text-slate-100 mb-1">{q.title}</h3>
                                <div className="text-slate-400 text-sm line-clamp-2">
                                    {parse(q.body)}
                                </div>
                                <div className="mt-2 text-xs text-slate-500">
                                    Asked on {new Date(q.created_at).toLocaleDateString()}
                                </div>
                            </li>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default UserQuestions;
