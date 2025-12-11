# How to Add Score Submission to Your Games

## For FlappyBron (flappybron.html)

Add the Firebase scripts to the `<head>` section:

```html
<!-- Firebase -->
<script src="https://www.gstatic.com/firebaseapps/9.22.2/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebaseapps/9.22.2/firebase-firestore.js"></script>
<script src="firebase-config.js"></script>
```

Then, find where the game ends (when the player loses/game is over). Add this code to submit the score:

```javascript
// Submit score to global leaderboard
submitScoreToLeaderboard('FlappyBron', score, difficulty);
```

Example: If you have a function like `gameOver()`, add it there:

```javascript
function gameOver() {
    // ... existing game over code ...
    
    // Submit to leaderboard
    submitScoreToLeaderboard('FlappyBron', score, currentDifficulty);
}
```

## For PacBron (pacbron.html)

Same steps as above, but replace 'FlappyBron' with 'PacBron':

```javascript
// Submit score to global leaderboard
submitScoreToLeaderboard('PacBron', score, 'normal');
```

## Testing

1. Complete the Firebase setup (see FIREBASE_SETUP.md)
2. Add the Firebase scripts to your game files
3. Add the `submitScoreToLeaderboard()` call to your game over functions
4. Play a game and finish it
5. Check the Firebase console to see your score
6. Refresh index.html and check the leaderboard tab

## What Gets Stored

When a score is submitted, it records:
- Game name (FlappyBron/PacBron)
- Player name (auto-generated if not set)
- Player ID (unique identifier)
- Score
- Difficulty level
- Timestamp
- Date

## Security Note

The current setup allows anyone to submit scores. For a production app, you might want to:
- Add authentication (sign-in)
- Validate scores on the backend
- Add rate limiting

But for now, the current setup works great for a fun game hub!
