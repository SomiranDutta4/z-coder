import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { TagsInput } from 'react-tag-input-component'
import './question.css'
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import axios from 'axios'

function Question() {
    const user = useSelector(selectUser);
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);

    const handleQuill = (value) => {
        setBody(value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (title !== "" && body !== "") {
            setLoading(true);
            const bodyJSON = {
                title: title,
                body: body,
                tag: JSON.stringify(tags),
                user: user
            }

            await axios.post('/api/question', bodyJSON).then((res) => {
                alert("Question added successfully");
                setLoading(false);
                navigate('/');
            }).catch((err) => {
                console.log(err);
                alert("Error Occured while adding question");
                setLoading(false);
            })
        }
    }

    const navigate = useNavigate();

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
        <div className='add-question'>
            <div className='add-question-container'>
                <div className='head-title'>
                    <h1>Ask a public question</h1>
                </div>
                <div className='question-container'>
                    <div className='question-options'>
                        <div className='question-option'>
                            <div className='title'>
                                <h3>Title</h3>
                                <small>
                                    Be specific and treat it as if you're asking this question to a person.
                                </small>
                                <input type='text' placeholder='Add question title' value={title} onChange={(e) => setTitle(e.target.value)} />
                            </div>
                        </div>
                        <div className='question-option'>
                            <div className='title'>
                                <h3>Body</h3>
                                <small>
                                    Include all the information someone would require to answer your question.
                                </small>
                                <ReactQuill value={body} className='react-quill' onChange={handleQuill} theme='snow' modules={modules} />
                            </div>
                        </div>
                        <div className='question-option'>
                            <div className='title'>
                                <h3>Tags</h3>
                                <small>
                                    Add upto 5 tags to descirbe what your question is about
                                </small>
                                <TagsInput
                                    value={tags}
                                    onChange={setTags}
                                    name='tags'
                                    placeHolder='press Enter to add new tag'
                                    color='black'
                                    classNames='tags-input'
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <button disabled={loading} type='submit' onClick={handleSubmit} className='ask-button'>{
                    loading ? 'Adding to database' : 'Add your question'
                }</button>
            </div>
        </div>
    )
}

export default Question

// import React from 'react'

// function Question() {
//     return (
//         <div>Question</div>
//     )
// }

// export default Question