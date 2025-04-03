'use client';

import { useState, useEffect } from 'react';
import { BarChart2, BookOpen, CheckCircle, Download, Video } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react'; // Import useSession hook for authentication
import { Button } from '@/components/ui/button'; // Assuming you're using a custom Button component

export default function Dashboard() {
  const [progress, setProgress] = useState({
    videosCompleted: 0,
    quizPassed: false,
    questionnaireCompleted: false,
    attestationDownloaded: false,
  });

  const { data: session, status } = useSession(); // Access session for authentication
  const [gotAttestation, setGotAttestation] = useState(false); // State for attestation status

  useEffect(() => {
    if (status === 'loading') return;

    if (!session || !session.user?.email) {
      console.error('User is not logged in');
      return;
    }

    const fetchAttestationStatus = async () => {
      try {
        const response = await fetch(`/api/certinfo?email=${session.user.email}`, {
          method: 'GET',
        });
    
        if (!response.ok) {
          throw new Error('echec du fetch du status de l attestation:');
        }
    
        const data = await response.json();
    
        if (data.gotAttestation !== undefined) {
          setGotAttestation(data.gotAttestation);
        }
      } catch (error) {
        console.error('echec du fetch du status de l attestation:', error);
      }
    };
  

    const fetchVideoData = async () => {
      try {
        const response = await fetch(`/api/video?email=${session.user.email}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch video data. Status: ${response.status}`);
        }
    
        const data = await response.json();
    
        if (data.success) {
          const videosCompleted =
            (data.videoStatus.video1Status === "Regarde" ? 1 : 0) +
            (data.videoStatus.video2Status === "Regarde" ? 1 : 0); 
    
          setProgress((prev) => ({
            ...prev,
            videosCompleted,
          }));
        } 
      } catch (error) {
        console.error('Error fetching video status:', error.message);
      }
    };
    

    const fetchQuestionnaireData = async () => {
      try {
        const response = await fetch(`/api/questionnaire?email=${session.user.email}`);
        if (!response.ok) {
          throw new Error('echec du fetch  de la data du questionnaire');
        }
    
        const data = await response.json();
        console.log('Questionnaire Data:', data); // Debugging line
    
        if (data.success) {
          const questionnaireCompleted = Object.values(data.userData).every(
            (value) => value !== null
          );
    
          setProgress((prev) => ({
            ...prev,
            questionnaireCompleted,
          }));
        }
      } catch (error) {
        console.error('echec du fetch du status du questionnaire:', error);
      }
    };

    const fetchQuizData = async () => {
      try {
        const response = await fetch(`/api/score?email=${session.user.email}`);
        if (!response.ok) {
          throw new Error('Echec du fetch pour la data du quiz');
        }
    
        const data = await response.json();
    
        if (data.success) {
          if (data.userData.score !== null) {
            const quizPassed = data.userData.score >= 7; // Assuming passing score is greater than 8
            setProgress((prev) => ({
              ...prev,
              quizPassed,
            }));
          } 
        } 
      } catch (error) {
        console.log('Erreur en cherchant la data du quiz:', error);
      }
    };

    fetchVideoData();
    fetchQuestionnaireData();
    fetchQuizData();
    fetchAttestationStatus();
  }, [session, status]);

  const calculateOverallProgress = () => {
    // Total steps should account for videos, quiz, questionnaire, and attestation
    const totalSteps = 4;
    const completedSteps = [
      progress.videosCompleted === 2, // Videos
      progress.quizPassed,           // Quiz
      progress.questionnaireCompleted, // Questionnaire
      gotAttestation,               // Attestation
    ].filter(Boolean).length;

    return Math.round((completedSteps / totalSteps) * 100);
  };

  const ProgressBar = ({ progress }) => (
    <div className="w-full bg-gray-100 rounded-full h-6 mb-6 relative">
      <div
        className="bg-blue-500 h-6 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <span className="sr-only">{`${progress}% Complété`}</span>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-white-500">{`${progress}%`}</span>
      </div>
    </div>
  );

  const ProgressItem = ({ icon: Icon, title, value, completed }) => (
    <div
      className={`flex items-center p-6 rounded-lg transition-all ${completed ? 'bg-blue-500 text-white-500' : 'bg-white text-black-500'}`}
    >
      <Icon
        className={`h-10 w-10 ${completed ? 'text-white-500' : 'text-blue-500'} mr-4`}
      />
      <div>
        <p className={`text-sm font-medium ${completed ? 'text-white-500' : 'text-black-500'} mb-1`}>{title}</p>
        <p className={`text-2xl font-bold ${completed ? 'text-white-500' : 'text-blue-500'}`}>{value}</p>
      </div>
      {completed && <CheckCircle className="h-6 w-6 text-white-500 ml-auto" />}
    </div>
  );

  const overallProgress = calculateOverallProgress();
  const isDownloadButtonVisible = progress.videosCompleted === 2 && progress.quizPassed && progress.questionnaireCompleted;


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white-500 mb-2">
        Training Progress &quot;{session?.user?.fullName.toUpperCase()}&quot;
        </h1>
          <p className="text-black-500 mb-4">Follow your learning journey!</p>


        <ProgressBar progress={overallProgress} />

        <div className="bg-white-500 shadow-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-black-600 mb-6">Completion status</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressItem
              icon={BookOpen}
              title="Watched Videos"
              value={`${progress.videosCompleted}/2`}
              completed={progress.videosCompleted === 2}
            />
            <ProgressItem
              icon={BarChart2}
              title="Quiz Performance"
              value={progress.quizPassed ? 'Passed' : 'Not Passed Yet'}
              completed={progress.quizPassed}
            />
            <ProgressItem
              icon={CheckCircle}
              title="Questionnaire"
              value={progress.questionnaireCompleted ? 'Finished' : 'Not Done Yet'}
              completed={progress.questionnaireCompleted}
            />
            <ProgressItem
              icon={Download}
              title="Certificate of training"
              value={gotAttestation ? 'Downloaded' : 'Not Downloaded Yet'}
              completed={gotAttestation}
            />
          </div>
        </div>

        {/* Section d'accès au contenu */}
        <div className="bg-white-500 shadow-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-black-600 mb-6">Access your Learning Materials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-6 bg-blue-200 rounded-lg">
              <Video className="h-10 w-10 text-blue-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-black-600 mb-1">Access the Videos</p>
                <Link href="/video" className="text-blue-500 font-bold text-xl">
                Watch the videos
                </Link>
              </div>
            </div>
            <div className="flex items-center p-6 bg-blue-200 rounded-lg">
              <BookOpen className="h-10 w-10 text-blue-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-black-600 mb-1">Complete the Questionnaire</p>
                <Link href="/questionnaire" className="text-blue-500 font-bold text-xl">
                Complete the Questionnaire
                </Link>
              </div>
            </div>
            <div className="flex items-center p-6 bg-blue-200 rounded-lg">
              <BarChart2 className="h-10 w-10 text-blue-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-black-600 mb-1">Take the Quiz</p>
                <Link href="/quiz" className="text-blue-500 font-bold text-xl">
                Take the Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>

        {isDownloadButtonVisible && (
          <Link href='/attestation'>
          <Button className="w-full mt-8 text-white-500 bg-blue-500 hover:bg-blue-700">
           Download the Certificate
          </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
