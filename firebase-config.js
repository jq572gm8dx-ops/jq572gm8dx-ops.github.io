// Firebase Configuration
// Replace with your own Firebase project credentials from console.firebase.google.com

const firebaseConfig = {
  apiKey: "AIzaSyDemoKeyReplace", // Replace with your API Key
  authDomain: "your-project.firebaseapp.com", // Replace with your Auth Domain
  projectId: "your-project-id", // Replace with your Project ID
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore instance
const db = firebase.firestore();

// Function to generate or get a unique player ID
function getPlayerId() {
  let playerId = localStorage.getItem('playerId');
  if (!playerId) {
    playerId = 'player_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('playerId', playerId);
  }
  return playerId;
}

// Function to get player name (with default)
function getPlayerName() {
  let playerName = localStorage.getItem('playerName');
  if (!playerName) {
    playerName = 'Player' + Math.floor(Math.random() * 9000 + 1000); // Random name like Player5234
    localStorage.setItem('playerName', playerName);
  }
  return playerName;
}

// Function to submit a score to Firebase
async function submitScoreToLeaderboard(gameName, score, difficulty = 'normal') {
  try {
    const playerId = getPlayerId();
    const playerName = getPlayerName();
    
    await db.collection('leaderboard').add({
      gameName: gameName,
      playerName: playerName,
      playerId: playerId,
      score: score,
      difficulty: difficulty,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      date: new Date().toLocaleDateString()
    });
    
    console.log('Score submitted to leaderboard!');
    return true;
  } catch (error) {
    console.error('Error submitting score:', error);
    return false;
  }
}

// Function to get top scores for a game
async function getTopScores(gameName, limit = 10) {
  try {
    const snapshot = await db.collection('leaderboard')
      .where('gameName', '==', gameName)
      .orderBy('score', 'desc')
      .limit(limit)
      .get();
    
    const scores = [];
    snapshot.forEach(doc => {
      scores.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return scores;
  } catch (error) {
    console.error('Error fetching scores:', error);
    return [];
  }
}

// Function to get player's personal best
async function getPlayerBest(gameName, playerId = null) {
  try {
    const id = playerId || getPlayerId();
    
    const snapshot = await db.collection('leaderboard')
      .where('gameName', '==', gameName)
      .where('playerId', '==', id)
      .orderBy('score', 'desc')
      .limit(1)
      .get();
    
    if (snapshot.empty) {
      return 0;
    }
    
    return snapshot.docs[0].data().score;
  } catch (error) {
    console.error('Error fetching player best:', error);
    return 0;
  }
}

// Function to get all-time stats
async function getAllTimeStats() {
  try {
    const snapshot = await db.collection('leaderboard').get();
    
    const stats = {
      totalScores: snapshot.size,
      games: {}
    };
    
    snapshot.forEach(doc => {
      const data = doc.data();
      if (!stats.games[data.gameName]) {
        stats.games[data.gameName] = {
          count: 0,
          topScore: 0
        };
      }
      stats.games[data.gameName].count++;
      if (data.score > stats.games[data.gameName].topScore) {
        stats.games[data.gameName].topScore = data.score;
      }
    });
    
    return stats;
  } catch (error) {
    console.error('Error fetching stats:', error);
    return null;
  }
}

// Real-time leaderboard listener
function listenToLeaderboard(gameName, callback, limit = 10) {
  try {
    return db.collection('leaderboard')
      .where('gameName', '==', gameName)
      .orderBy('score', 'desc')
      .limit(limit)
      .onSnapshot(snapshot => {
        const scores = [];
        snapshot.forEach(doc => {
          scores.push({
            id: doc.id,
            ...doc.data()
          });
        });
        callback(scores);
      });
  } catch (error) {
    console.error('Error setting up listener:', error);
    return null;
  }
}
