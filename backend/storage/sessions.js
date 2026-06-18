"use strict";

const sessions = [];

function create(session) {
	sessions.push(session);
	return session;
}

function list() {
	return sessions.slice();
}

function find(predicate) {
	return sessions.find(predicate);
}

function remove(predicate) {
	const idx = sessions.findIndex(predicate);
	if (idx === -1) return null;
	return sessions.splice(idx, 1)[0];
}

module.exports = {
	create,
	list,
	find,
	remove,
};