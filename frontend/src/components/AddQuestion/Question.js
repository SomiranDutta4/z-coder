import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { TagsInput } from 'react-tag-input-component';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectUser } from '../../features/userSlice';
import axios from 'axios';

function Question() {
    const user = useSelector(selectUser);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    const navigate = useNavigate();

    const handleQuill = (value) => setBody(value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (title !== "" && body !== "") {
            setLoading(true);
            const bodyJSON = {
                title: title,
                body: body,
                tag: JSON.stringify(tags),
                user: user
            };

            await axios.post(process.env.REACT_APP_backendUrl + '/api/question', bodyJSON)
                .then(() => {
                    alert("Question added successfully");
                    setLoading(false);
                    navigate('/');
                })
                .catch((err) => {
                    console.error(err);
                    alert("Error Occurred while adding question");
                    setLoading(false);
                });
        }
    };

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

    return (
        <div className="flex justify-center px-4 pt-7 text-white">
            <div className="w-full max-w-3xl bg-[#1e1e1e] rounded-xl p-6 shadow-lg border border-[#2c2c2c]">
                <h1 className="text-3xl font-semibold mb-6">Ask a Public Question</h1>

                {/* Title */}
                <div className="mb-6">
                    <label className="block font-medium mb-2">Title</label>
                    <small className="text-gray-400 mb-2 block">
                        Be specific and imagine you’re asking a question to another person.
                    </small>
                    <input
                        type="text"
                        placeholder="e.g. How to implement a binary search in JavaScript?"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full p-3 rounded-lg bg-[#2b2b2b] border border-[#444] outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Body */}
                <div className="mb-6">
                    <label className="block font-medium mb-2">Body</label>
                    <small className="text-gray-400 mb-2 block">
                        Include all the details someone would need to answer your question.
                    </small>
                    <ReactQuill
                        value={body}
                        onChange={handleQuill}
                        theme="snow"
                        modules={modules}
                        className="bg-white rounded-md text-black"
                        style={{ color: '#000', minHeight: '180px', paddingBottom: '50px' }}
                    />
                </div>

                {/* Tags */}
                <div className="mb-6">
                    <label className="block font-medium mb-2">Tags</label>
                    <small className="text-gray-400 mb-2 block">
                        Add up to 5 tags to describe what your question is about.
                    </small>
                    <TagsInput
                        value={tags}
                        onChange={setTags}
                        name="tags"
                        placeHolder="Press Enter to add tags"
                        classNames={{
                            input: "bg-[#2b2b2b] text-white border border-[#444] px-2 py-1 rounded-lg focus:outline-none",
                        }}
                    />
                </div>

                {/* Submit Button */}
                <div className="text-right">
                    <button
                        disabled={loading}
                        onClick={handleSubmit}
                        className={`px-6 py-2 rounded-md font-medium transition-colors duration-200 ${loading
                                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                : "bg-indigo-600 hover:bg-indigo-700 text-white"
                            }`}
                    >
                        {loading ? "Submitting..." : "Post Your Question"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Question;
