'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"
import { useSession } from "next-auth/react"
import questions from './questions'
import Results from './Results'

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState<number>(0) // Default score is 0
  const [showScore, setShowScore] = useState(false)
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null))
  const { toast } = useToast()
  const { data: session } = useSession()

  useEffect(() => {
    if (session?.user?.email) {
      fetchUserScore(session.user.email)
    }
  }, [session])

  const fetchUserScore = async (email: string) => {
    try {
      const response = await fetch(`/api/score?email=${encodeURIComponent(email)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user score');
      }
  
      const data = await response.json();
  
      if (data.success) {
        // If there's a valid score
        if (data.userData?.score !== null) {
          const score = data.userData.score;
  
          if (score >= 7) {
            // If score is 8 or above, show it
            setScore(score);
            setShowScore(true);
          } else {
            // If score is less than 8
            setScore(score);
            setShowScore(false);
            toast({
              title: "Inferior Score",
              description: `Your score is ${score}, You must have the exam again.`,
              variant: "default",
            });
          }
        } else {
          // If no score (first exam attempt)
          setScore(0);
          setShowScore(false);
          toast({
            title: "First Exam Attempt",
            description: "Good luck with your exam!",
            variant: "default",
          });
        }
      } else {
        // Handle case when success is false
        console.log(data.message || "Unknown error occurred");
        toast({
          title: "Message",
          description: data.message || "Can't fetch user score",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error fetching user score:', error);
      toast({
        title: "Message",
        description: "Can't fetch user score",
        variant: "default",
      });
    }
  };
  
  
  
  

  const handleAnswerOptionClick = (answerIndex: number) => {
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestion] = answerIndex
    setUserAnswers(newUserAnswers)

    const isCorrect = questions[currentQuestion].answerOptions[answerIndex].isCorrect
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1) // Increment score directly
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setShowScore(true)
      sendScoreToDatabase()
    }
  }

  const sendScoreToDatabase = async () => {
    if (!session?.user?.email) return

    try {
      const response = await fetch('/api/score', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: session.user.email,
          score, // Send raw score without formatting
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save score')
      }

      const data = await response.json()
      console.log('Score saved:', data)
      toast({
        title: "Score Registered",
        description: "Your score has been saved successfully.",
      })
    } catch (error) {
      console.error('Error saving score:', error)
      toast({
        title: "Erreur",
        description: "Can't save your score",
        variant: "destructive",
      })
    }
  }

  const restartQuiz = () => {
    setCurrentQuestion(0)
    setScore(0) // Reset score to 0
    setShowScore(false)
    setUserAnswers(new Array(questions.length).fill(null))
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
    <Card className="w-full max-w-7xl bg-white-500 shadow-lg">
      <CardHeader>
        <CardTitle>Quiz about Ethic and Anti Corruption</CardTitle>
      </CardHeader>
      <CardContent>
        {showScore ? (
          <Results score={score} totalQuestions={questions.length} onRestart={restartQuiz} />
        ) : (
          <>
            <Progress value={(currentQuestion + 1) / questions.length * 100} className="mb-4 bg-gray-200" />
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">
                Question {currentQuestion + 1}/{questions.length}
              </h2>
              <p className="text-lg">{questions[currentQuestion].question}</p>
            </div>
            <div className="space-y-2">
              {questions[currentQuestion].answerOptions.map((answerOption, index) => (
                <Button
                  key={index}
                  onClick={() => handleAnswerOptionClick(index)}
                  variant={userAnswers[currentQuestion] === index ? "default" : "outline"}
                  className={`w-full justify-start h-auto py-3 px-4 text-left ${
                    userAnswers[currentQuestion] === index
                      ? 'bg-blue-500 text-white-500 hover:bg-blue-600'
                      : 'bg-white-500 text-black-500 hover:bg-blue-100'
                  }`}
                >
                  {answerOption.answer}
                </Button>
              ))}
            </div>
          </>
        )}
      </CardContent>
      {!showScore && (
        <CardFooter className="flex justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            variant="outline"
            className="bg-white-500 text-black-500 hover:bg-blue-100"
          >
            Back
          </Button>
          <Button 
            onClick={handleNext}
            className="bg-blue-500 text-white-500 hover:bg-blue-600"
          >
            {currentQuestion === questions.length - 1 ? 'Finished' : 'Next'}
          </Button>
        </CardFooter>
      )}
    </Card>
    </div>
  )
}

export default Quiz
