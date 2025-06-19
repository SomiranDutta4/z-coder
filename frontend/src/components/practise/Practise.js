import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectBookmarks,
    setBookmarks,
    addBookmark,
    removeBookmark,
} from '../../features/bookmarkSlice';
import Papa from 'papaparse';
import COMPANIES from './companies'
import TOPIC_TAGS from './Topic_tags';

const tabs = [
    {
        topic: 'LeetCode questions',
        link: ''
    },
    {
        topic: 'Striver`s Sheet',
        link: 'https://takeuforward.org/strivers-a2z-dsa-course/strivers-a2z-dsa-course-sheet-2/',

    },
    {
        topic: 'Competitive Programming'
    },
    {
        topic: 'CP 31 sheet',
        link: 'https://www.tle-eliminators.com/cp-sheet'
    }
];

const Practise = () => {
    const [activeTab, setActiveTab] = useState('DSA');
    const [dsaData, setDsaData] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [showFilterSidebar, setShowFilterSidebar] = useState(false);
    const [showTabDropdown, setShowTabDropdown] = useState(false);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [showingBookmarked, setShowingBookmarked] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [showCompanyFilter, setShowCompanyFilter] = useState(false);


    const bookmarksFromRedux = useSelector(selectBookmarks);
    const user = useSelector(state => state.user.value);
    const dispatch = useDispatch();


    useEffect(() => {
        if (activeTab === 'DSA' && !selectedCompany) {
            fetchQuestions(1, false);
        }
    }, [activeTab, selectedTags, selectedCompany]);

    const handleCompanyToggle = async (company) => {

        const isUnselecting = selectedCompany === company;
        const newCompany = isUnselecting ? null : company;

        setSelectedCompany(newCompany);
        setShowCompanyFilter(false);
        setSelectedTags([]); // clear topic filters

        if (!newCompany) {
            // no company selected — revert to LeetCode data
            fetchQuestions(1, false);
            return;
        }

        try {
            const filePath = `/leetcode-companies/${newCompany}/5. All.csv`;
            const response = await fetch(filePath);
            const csvText = await response.text();
            const data = Papa.parse(csvText, {
                header: true,
                skipEmptyLines: true,
            });
            setDsaData(data.data);
        } catch (error) {
            console.error('Failed to load CSV:', error);
            setDsaData([]);
        }
    };

    // const handleCompanyToggle = async (company) => {
    //     if (selectedCompany === company) {
    //         setSelectedCompany(null);
    //         return;
    //     }
    //     setSelectedCompany(company)
    // };

    // const setcompanyfilter = async () => {
    //     setShowCompanyFilter(false);

    //     if (!selectedCompany) {
    //         setDsaData([])
    //         fetchQuestions(1, false);
    //         return;
    //     }

    //     try {
    //         const filePath = `/leetcode-companies/${selectedCompany}/5. All.csv`;
    //         const response = await fetch(filePath);
    //         const csvText = await response.text();
    //         const data = Papa.parse(csvText, {
    //             header: true,
    //             skipEmptyLines: true,
    //         });
    //         setDsaData(data.data);
    //     } catch (error) {
    //         console.error('Failed to load CSV:', error);
    //         setDsaData([]);
    //     }
    // };



    const fetchQuestions = async (pageToFetch = 1, append = false) => {
        setIsLoading(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_backendUrl}/api/practise/questions/DSA?page=${pageToFetch}`, {
                topicSlug: selectedTags,
            });

            const fetchedQuestions = res.data.questions || [];

            setDsaData(prev => append ? [...prev, ...fetchedQuestions] : fetchedQuestions);
            setPage(pageToFetch);  // update current page
        } catch (err) {
            console.error('Error fetching questions:', err.message);
            if (!append) setDsaData([]);
        }
        setIsLoading(false);
    };


    const handleTagToggle = (slug) => {
        setSelectedTags(prev =>
            prev.includes(slug) ? prev.filter(tag => tag !== slug) : [...prev, slug]
        );
    };

    const handleBookmarkToggle = async question => {
        if (!user?.uid || !question.titleSlug) return;

        const isBookmarked = bookmarksFromRedux.some(q => q.titleSlug === question.titleSlug);

        try {
            await axios.post(`${process.env.REACT_APP_backendUrl}/api/practise/bookmark/question`, {
                uid: user.uid,
                question,
                bookmark: !isBookmarked,
            });

            if (isBookmarked) {
                dispatch(removeBookmark(question.titleSlug));

                if (showingBookmarked) {
                    // also remove from current view
                    setDsaData(prev => prev.filter(q => q.titleSlug !== question.titleSlug));
                }

            } else {
                dispatch(addBookmark(question));
            }
        } catch (err) {
            console.error('Failed to toggle bookmark:', err);
        }
    };



    useEffect(() => {
        const loadBookmarks = async () => {
            if (user?.uid && bookmarksFromRedux.length === 0) {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_backendUrl}/api/practise/bookmarks/all?uid=${user.uid}`);
                    dispatch(setBookmarks(res.data)); // store full objects
                } catch (err) {
                    console.error("Failed to load bookmarks:", err);
                }
            }
        };

        loadBookmarks();
    }, [user?.uid, bookmarksFromRedux.length]);

    useEffect(() => {
        if (selectedCompany && showFilterSidebar) {
            setShowFilterSidebar(false);
        }
    }, [selectedCompany, showFilterSidebar]);

    return (
        <div className="w-full max-w-5xl mx-auto px-3 py-4 text-white font-inter relative">
            <div className="relative inline-block mb-2 w-full">
                <div className="flex justify-between items-center gap-2 flex-wrap">
                    <div className="relative">
                        <button
                            onClick={() => setShowTabDropdown(prev => !prev)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm"
                        >
                            Category: {activeTab}
                        </button>
                        {showTabDropdown && (
                            <div className="absolute left-0 mt-1 w-40 bg-gray-800 rounded shadow-lg z-10">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.topic}
                                        onClick={() => {
                                            setActiveTab(tab.topic);
                                            setShowTabDropdown(false);
                                            setShowingBookmarked(false);
                                            if (tab.link) {
                                                window.open(tab.link, '_blank');
                                                return;
                                            }
                                        }}
                                        className='block w-full text-left px-4 py-2 text-sm bg-blue-700'
                                    >
                                        {tab.topic}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                if (showingBookmarked) {
                                    setSelectedTags([]); // clear filters
                                    setDsaData([]); // clear current data
                                    fetchQuestions(1, false); // fetch all questions
                                } else {
                                    setDsaData(bookmarksFromRedux); // set only bookmarked
                                }
                                setPage(1);
                                setShowingBookmarked(prev => !prev);
                            }}
                            className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1.5 rounded-md text-sm"
                        >
                            {showingBookmarked ? 'Show All Questions' : 'Show Bookmarked'}
                        </button>
                        {!showingBookmarked && (
                            <>
                                {!selectedCompany && (
                                    <button
                                        onClick={() => setShowFilterSidebar(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm"
                                    >
                                        Filter Topics
                                    </button>
                                )}

                                <button
                                    onClick={() => setShowCompanyFilter(true)}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm"
                                >
                                    Filter Companies
                                </button>
                            </>
                        )}
                    </div>
                </div>

            </div>

            <div className="bg-[#0f172a] rounded-lg shadow-lg p-4 space-y-3">
                {dsaData.map((q, idx) => {
                    // Normalize data for compatibility
                    const title = q.title || q.Title || 'Untitled';
                    const difficulty = (q.difficulty || q.Difficulty || 'Unknown').toLowerCase();
                    const acRate = parseFloat(q.acRate || q['Acceptance Rate'] * 100 || 0);
                    const link = q.titleSlug
                        ? `https://leetcode.com/problems/${q.titleSlug}/`
                        : q.Link || '#';
                    const tagsRaw = q.topicTags || q.Topics || [];
                    const tags = Array.isArray(tagsRaw)
                        ? tagsRaw.map(tag => tag.name || tag).join(', ')
                        : tagsRaw;

                    return (
                        <div
                            // onClick={ ()=>{window.open(link, '_blank')} }
                            key={idx}
                            className="border border-gray-700 rounded-md p-3 hover:bg-gray-800 transition-all flex justify-between items-center"
                        >
                            <div className="flex-1 pr-4">
                                <a
                                    href={link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-base font-semibold text-blue-400 hover:underline"
                                >
                                    {title}
                                </a>
                                <div className="text-xs text-gray-400 mt-1">
                                    Difficulty:{' '}
                                    <span
                                        className={`font-medium ${difficulty === 'easy'
                                            ? 'text-green-400'
                                            : difficulty === 'medium'
                                                ? 'text-yellow-400'
                                                : 'text-red-400'
                                            }`}
                                    >
                                        {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                                    </span>{' '}
                                    | Acceptance Rate: {isNaN(acRate) ? 'N/A' : `${acRate.toFixed(2)}%`} | Tags: {tags}
                                </div>
                            </div>
                            {!selectedCompany &&
                                <button
                                    onClick={() => handleBookmarkToggle(q)}
                                    className="text-gray-400 hover:text-yellow-400"
                                    title={
                                        bookmarksFromRedux.some(
                                            b =>
                                                b.titleSlug === q.titleSlug ||
                                                b.Link === q.Link
                                        )
                                            ? 'Remove Bookmark'
                                            : 'Bookmark'
                                    }
                                >
                                    {bookmarksFromRedux.some(
                                        b =>
                                            b.titleSlug === q.titleSlug ||
                                            b.Link === q.Link
                                    ) ? (
                                        <BookmarkCheck size={20} />
                                    ) : (
                                        <Bookmark size={20} />
                                    )}
                                </button>
                            }
                        </div>
                    );
                })}

            </div>
            {!showingBookmarked && !selectedCompany &&
                <div className="flex justify-center mt-4">
                    <button
                        onClick={() => fetchQuestions(page + 1, true)}
                        className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md ${isLoading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        disabled={isLoading}
                    >
                        Load More
                    </button>
                </div>
            }
            {showCompanyFilter && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setShowCompanyFilter(false)}
                    />
                    <div className="fixed top-[9vh] right-0 h-[91vh] w-72 bg-gray-900 z-50 shadow-lg transition-transform duration-300 ease-in-out flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-700">
                            <h2 className="text-lg font-semibold text-white">Filter Companies</h2>
                            <button
                                onClick={() => setShowCompanyFilter(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {COMPANIES.map(company => (
                                <button
                                    key={company}
                                    onClick={() => handleCompanyToggle(company)}
                                    className={`w-full text-left px-3 py-1.5 rounded text-sm border transition 
              ${selectedCompany == company
                                            ? 'bg-green-600 border-green-600'
                                            : 'bg-gray-800 border-gray-600 hover:border-gray-400'
                                        }`}
                                >
                                    {company}
                                </button>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-700">
                            <button
                                onClick={() => { setShowCompanyFilter(false) }}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </>
            )}


            {showFilterSidebar && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40"
                        onClick={() => setShowFilterSidebar(false)}
                    />
                    <div className="fixed top-[9vh] right-0 h-[91vh] w-72 bg-gray-900 z-50 shadow-lg transition-transform duration-300 ease-in-out flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-gray-700">
                            <h2 className="text-lg font-semibold text-white">Filter Topics</h2>
                            <button
                                onClick={() => setShowFilterSidebar(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {TOPIC_TAGS.map(tag => (
                                <button
                                    key={tag.slug}
                                    onClick={() => handleTagToggle(tag.slug)}
                                    className={`w-full text-left px-3 py-1.5 rounded text-sm border transition 
                    ${selectedTags.includes(tag.slug)
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'bg-gray-800 border-gray-600 hover:border-gray-400'
                                        }`}
                                >
                                    {tag.name}
                                </button>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-700">
                            <button
                                onClick={() => setShowFilterSidebar(false)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Practise;
