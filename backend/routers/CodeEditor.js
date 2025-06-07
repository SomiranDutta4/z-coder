const express = require('express');
const axios = require('axios');
const router = express.Router();
const base64 = require('base-64');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const executeCode = async (language, code) => {
    console.log('Executing code:', language, code);
    const languageMappings = {
        'python': 71,
        'java': 62,
        'c_cpp': 54
    };

    const source_code = base64.encode(code);
    const language_id = languageMappings[language];

    try {
        const postResponse = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
            source_code,
            language_id
        },
            {
                params: {
                    base64_encoded: 'true',
                    wait: 'false',  // we'll wait manually below
                    fields: '*'
                },
                headers: {
                    'x-rapidapi-key': 'ec95ce2d64msh2d6a9400abc8e7dp158c0cjsn642e736d34b2',
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                    'Content-Type': 'application/json'
                }
            });

        const token = postResponse.data.token;
        console.log('Submission Token:', token);

        // 🕒 Poll every 500ms until result is ready or timeout (max 10 tries)
        let resultResponse = null;
        let attempt = 0;
        const maxAttempts = 10;

        while (attempt < maxAttempts) {
            await sleep(500);
            const res = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
                params: {
                    base64_encoded: 'true',
                    fields: '*'
                },
                headers: {
                    'x-rapidapi-key': 'ec95ce2d64msh2d6a9400abc8e7dp158c0cjsn642e736d34b2',
                    'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
                    'Content-Type': 'application/json'
                }
            });

            if (res.data.status.id <= 2) {
                attempt++;
                continue;  // still processing
            }

            resultResponse = res.data;
            break;
        }

        if (!resultResponse) {
            return 'Timeout: No result received.';
        }


        if (resultResponse.stdout) {
            return base64.decode(resultResponse.stdout);
        } else if (resultResponse.stderr) {
            return 'Error: ' + base64.decode(resultResponse.stderr);
        } else if (resultResponse.compile_output) {
            return 'Compilation Error: ' + base64.decode(resultResponse.compile_output);
        } else {
            return 'No output.';
        }
    } catch (error) {
        console.error('Error executing code:', error);
        return 'Internal error';
    }
};


// const executeCode = async (language, code) => {
//     console.log('Executing code:', language, code);
//     const languageMappings = {
//         'python': 71,
//         'java': 62,
//         'c_cpp': 54
//     };

//     const source_code = base64.encode(code);
//     const language_id = languageMappings[language];

//     try {
//         const response = await axios.post('https://judge0-ce.p.rapidapi.com/submissions', {
//             source_code,
//             language_id
//         },
//             {
//                 params: {
//                     base64_encoded: 'true',
//                     wait: 'false',
//                     fields: '*'
//                 },
//                 headers: {
//                     'x-rapidapi-key': 'ec95ce2d64msh2d6a9400abc8e7dp158c0cjsn642e736d34b2',
//                     'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
//                     'Content-Type': 'application/json'
//                 }
//             });

//         console.log(response.data);

//         const token = await response.data.token;

//         const resultResponse = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${token}`, {
//             params: {
//                 base64_encoded: 'true',
//                 fields: '*'
//             },
//             headers: {
//                 'Content-Type': 'application/json',
//                 // 'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
//                 'x-rapidapi-ua': 'RapidAPI-Playground',
//                 'x-rapidapi-key': 'ec95ce2d64msh2d6a9400abc8e7dp158c0cjsn642e736d34b2',
//                 'x-rapidapi-host': 'judge0-ce.p.rapidapi.com'
//             }
//         });
//         console.log(response.data);
//         console.log(response.status);
//         console.log('resultResponse:', resultResponse.data.stdout);
//         // console.log(base64.decode(resultResponse.data.stdout))

//         if (resultResponse.data.stdout) {
//             return base64.decode(resultResponse.data.stdout);
//         } else if (resultResponse.data.stderr) {
//             return base64.decode(resultResponse.data.stderr);
//         } else {
//             return 'No output';
//         }
//     } catch (error) {
//         console.error('Error executing code:', error);
//         return 'Error executing code';
//     }
// };

router.post('/execute', async (req, res) => {
    const { language, code } = req.body;

    if (!['python', 'java', 'c_cpp'].includes(language)) {
        return res.status(400).send({ output: 'Unsupported language' });
    }

    const output = await executeCode(language, code);
    res.send({ output });
});

module.exports = router;