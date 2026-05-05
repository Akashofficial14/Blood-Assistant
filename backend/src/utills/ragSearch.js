const knowledgeBase = require("../config/knowledgeBase");

function searchKnowledgeBase(userQuery) {
  const query = userQuery.toLowerCase().trim();
  const scores = [];

  for (const entry of knowledgeBase) {
    let score = 0;

    // Check keyword matches
    for (const keyword of entry.keywords) {
      if (query.includes(keyword.toLowerCase())) {
        score += 2;
      }
    }

    // Check topic match
    if (query.includes(entry.topic.toLowerCase())) {
      score += 3;
    }

    // Check word-by-word partial match
    const queryWords = query.split(/\s+/);
    for (const word of queryWords) {
      if (word.length > 3) {
        for (const keyword of entry.keywords) {
          if (keyword.toLowerCase().includes(word)) {
            score += 1;
          }
        }
      }
    }

    if (score > 0) {
      scores.push({ entry, score });
    }
  }

  // Sort by score descending
  scores.sort((a, b) => b.score - a.score);

  // Return top 2 most relevant entries
  return scores.slice(0, 2).map((s) => s.entry);
}

module.exports = { searchKnowledgeBase };
