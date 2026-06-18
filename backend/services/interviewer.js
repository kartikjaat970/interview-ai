const questions = [
	'Tell me about a technical challenge.',
	'Explain a project you built.',
	'What tradeoffs did you make?',
	'How would you improve scalability?',
];

/**
 * Return a random interview question.
 * @param {string} [message] - optional candidate message (currently unused)
 * @returns {{ answer: string }}
 */
function reply(message) {
	const idx = Math.floor(Math.random() * questions.length);
	return { answer: questions[idx] };
}

module.exports = { reply };