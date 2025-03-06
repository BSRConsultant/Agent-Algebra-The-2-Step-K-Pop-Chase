import React, { useState, useEffect } from 'react';
import { AlertCircle, HelpCircle, Award, Music, Check } from 'lucide-react';

const KpopDetectiveGame = () => {
  const [currentMystery, setCurrentMystery] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentClue, setCurrentClue] = useState(1);
  const [equation, setEquation] = useState('');
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [showDialog, setShowDialog] = useState(true);
  const [dialogContent, setDialogContent] = useState({ character: 'Felix', text: "I was teaching Min-ji some dance moves in the practice room, but now she's gone! Can you help us find her?" });
  
  // Generate equation based on current level
  useEffect(() => {
    generateEquation(currentLevel);
  }, [currentLevel, currentClue]);
  
  const generateEquation = (level) => {
    let newEquation = '';
    let correctAnswer = 0;
    
    switch(level) {
      case 1: // ax + b = 0
        const a = Math.floor(Math.random() * 4) + 2; // 2-5
        const b = Math.floor(Math.random() * 21) - 10; // -10 to 10
        newEquation = `${a}x + ${b} = 0`;
        correctAnswer = -b / a;
        break;
      case 2: // ax + b = c
        const a2 = Math.floor(Math.random() * 4) + 3; // 3-6
        const b2 = Math.floor(Math.random() * 31) - 15; // -15 to 15
        const c2 = Math.floor(Math.random() * 21) - 10; // -10 to 10
        newEquation = `${a2}x + ${b2} = ${c2}`;
        correctAnswer = (c2 - b2) / a2;
        break;
      // Additional cases would be implemented for levels 3-7
      default:
        newEquation = '2x + 4 = 0';
        correctAnswer = -2;
    }
    
    setEquation(newEquation);
  };
  
  const checkAnswer = () => {
    // This would include validation and checking against the actual answer
    // For demo purposes, we'll just advance the game
    if (userAnswer.trim() !== '') {
      setFeedback('Correct! You found a clue!');
      setScore(score + 100 - (hintsUsed * 25));
      advanceGame();
    } else {
      setFeedback('Please enter an answer.');
    }
  };
  
  const advanceGame = () => {
    // Move to next clue or mystery
    if (currentClue < 3) {
      setCurrentClue(currentClue + 1);
      showCharacterDialog();
    } else {
      // Completed all clues in current mystery
      if (currentMystery < 7) {
        setCurrentMystery(currentMystery + 1);
        setCurrentClue(1);
        showMysteryComplete();
      } else {
        // Game complete
        showGameComplete();
      }
    }
    
    setUserAnswer('');
    setHintsUsed(0);
    setShowHint(false);
  };
  
  const useHint = () => {
    if (hintsUsed < 3) {
      setHintsUsed(hintsUsed + 1);
      setShowHint(true);
    }
  };
  
  const showCharacterDialog = () => {
    // Different dialogs based on current mystery and clue
    let character = 'Felix';
    let text = "Let's check the next clue!";
    
    if (currentMystery === 1) {
      if (currentClue === 1) {
        character = 'Hyunjin';
        text = "I checked the practice log. The room number is hidden in this equation!";
      } else if (currentClue === 2) {
        character = 'Bang Chan';
        text = "The security footage shows her walking by. Let me check the timestamp...";
      }
    }
    
    setDialogContent({ character, text });
    setShowDialog(true);
  };
  
  const showMysteryComplete = () => {
    setDialogContent({
      character: 'Team',
      text: `Great work! Mystery ${currentMystery} solved! Now we're getting closer to finding Min-ji!`
    });
    setShowDialog(true);
  };
  
  const showGameComplete = () => {
    setDialogContent({
      character: 'Min-ji',
      text: "You found me! I wasn't missing at all - I was preparing for my surprise debut performance! Thank you for solving all the mysteries!"
    });
    setShowDialog(true);
  };
  
  const getHintText = () => {
    switch(hintsUsed) {
      case 1:
        return "Hint 1: Move all terms with x to one side, and all other terms to the other side.";
      case 2:
        return "Hint 2: After grouping terms, divide both sides by the coefficient of x.";
      case 3:
        return `Hint 3: Step-by-step solution: ${equation} → x = ...`;
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col h-screen bg-blue-50 text-gray-800">
      {/* Game Header */}
      <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold">K-Pop Academy Detective</h1>
          <p className="text-sm">Mystery {currentMystery}: {getMysteryTitle(currentMystery)}</p>
        </div>
        <div className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          <span className="font-bold">{score}</span>
        </div>
      </div>
      
      {/* Dialog Modal */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-10">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  {dialogContent.character.charAt(0)}
                </div>
                <h3 className="font-bold text-lg">{dialogContent.character}</h3>
              </div>
              <p>{dialogContent.text}</p>
              <button 
                className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                onClick={() => setShowDialog(false)}
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Game Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-1">
              Clue {currentClue}/3 • Level {getLevelForClue(currentMystery, currentClue)}
            </div>
            <h2 className="text-lg font-bold mb-2">{getClueTitle(currentMystery, currentClue)}</h2>
            <div className="bg-blue-100 p-4 rounded-lg text-center text-xl mb-4">
              {equation}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Solve for x:
            </label>
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your answer..."
            />
          </div>
          
          {feedback && (
            <div className={`mb-4 p-3 rounded-lg ${feedback.includes('Correct') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {feedback}
            </div>
          )}
          
          {showHint && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
              {getHintText()}
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={useHint}
              disabled={hintsUsed >= 3}
              className={`flex items-center gap-1 py-2 px-4 rounded-lg ${hintsUsed >= 3 ? 'bg-gray-200 text-gray-500' : 'bg-yellow-500 text-white hover:bg-yellow-600'}`}
            >
              <HelpCircle className="h-5 w-5" />
              Hint
            </button>
            <button
              onClick={checkAnswer}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-1"
            >
              <Check className="h-5 w-5" />
              Submit
            </button>
          </div>
        </div>
      </div>
      
      {/* Navigation/Progress Bar */}
      <div className="bg-gray-100 p-4">
        <div className="max-w-md mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${((currentMystery - 1) * 3 + currentClue) / 21 * 100}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Mystery 1</span>
            <span>Mystery 7</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions to map mysteries and clues to titles
const getMysteryTitle = (mysteryNumber) => {
  const titles = [
    "",
    "The Missing Trainee",
    "The Secret Practice Room",
    "The Debut Preparation",
    "The First Performance",
    "The Music Video Mystery",
    "The Award Show Puzzle",
    "The World Tour Launch"
  ];
  return titles[mysteryNumber] || "";
};

const getClueTitle = (mysteryNumber, clueNumber) => {
  if (mysteryNumber === 1) {
    const clues = ["", "Floor Number", "Room Number", "Time"];
    return clues[clueNumber] || "";
  }
  // Add more mystery clue titles as needed
  return `Clue ${clueNumber}`;
};

const getLevelForClue = (mysteryNumber, clueNumber) => {
  // Map mystery and clue number to difficulty level
  if (mysteryNumber === 1) {
    return clueNumber; // For mystery 1, levels match clue numbers
  }
  return Math.min(7, mysteryNumber + clueNumber - 1);
};

export default KpopDetectiveGame;
