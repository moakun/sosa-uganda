import React from 'react'
import Link from 'next/link'
import { Progress } from "@/components/ui/progress"

interface ResultsProps {
  score: number
  totalQuestions: number
  onRestart: () => void
}

const Results: React.FC<ResultsProps> = ({ score, totalQuestions, onRestart }) => {
  const percentage = (score / totalQuestions) * 100

  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-4">Quiz terminé!</h2>
      <p className="text-2xl mb-4">
        Your score is: {score} / {totalQuestions}
      </p>
      <Progress value={percentage} className="mb-4" />
      <div className="flex justify-center space-x-4 mt-6">
        {/* Restart Quiz Button */}
        <button 
          onClick={onRestart} 
          className="px-4 py-2 bg-blue-500 text-white-500 rounded hover:bg-blue-800"
        >
          Restart the quiz
        </button>

        {/* Link to Dashboard */}
        <Link 
          href="/dashboard" 
          className="px-4 py-2 bg-blue-500 text-white-500 rounded hover:bg-blue-800"
        >
          Return to Dashboard
        </Link>

        {/* Link to Questionnaire */}
        <Link 
          href="/questionnaire" 
          className="px-4 py-2 bg-blue-500 text-white-500 rounded hover:bg-blue-800"
        >
          Go to Questionnaire
        </Link>
      </div>
    </div>
  )
}

export default Results
