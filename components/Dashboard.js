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
    questionnaireCompleted: 0,
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

    // Fetch attestation status
    const fetchAttestationStatus = async () => {
      try {
        const response = await fetch(`/api/certinfo?email=${session.user.email}`, {
          method: 'GET',
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch attestation status');
        }
  
        const data = await response.json();
        if (data.gotAttestation !== undefined) {
          setGotAttestation(data.gotAttestation);
        }
      } catch (error) {
        console.error('Error fetching attestation status:', error);
      }
    };
  

    // Fetch video data
    const fetchVideoData = async () => {
      try {
        const response = await fetch(`/api/video?email=${session.user.email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch video data');
        }

        const data = await response.json();
        if (data.success) {
          const videosCompleted =
            (data.videoStatus.video1Status === 'Regarde' ? 1 : 0) +
            (data.videoStatus.video2Status === 'Regarde' ? 1 : 0);

          setProgress((prev) => ({
            ...prev,
            videosCompleted,
          }));
        } else {
          console.error('Error fetching video data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching video status:', error);
      }
    };

    // Fetch questionnaire data
    const fetchQuestionnaireData = async () => {
      try {
        const response = await fetch(`/api/questionnaire?email=${session.user.email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch questionnaire data');
        }

        const data = await response.json();
        if (data.success) {
          const questionnaireCompleted = Object.values(data.userData).every(
            (value) => value !== null
          );

          setProgress((prev) => ({
            ...prev,
            questionnaireCompleted: questionnaireCompleted ? 1 : 0,
          }));
        } else {
          console.error('Error fetching questionnaire data:', data.error);
        }
      } catch (error) {
        console.error('Error fetching questionnaire status:', error);
      }
    };

    // Fetch quiz score data
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`/api/score?email=${session.user.email}`);
        if (!response.ok) {
          throw new Error('Failed to fetch quiz data');
        }

        const data = await response.json();
        if (data.success) {
          if (data.userData.score !== null) {
            const quizPassed = data.userData.score > 8; // Assuming passing score is greater than 8
            setProgress((prev) => ({
              ...prev,
              quizPassed,
            }));
          } else {
            setProgress((prev) => ({
              ...prev,
              quizPassed: false,
            }));
          }
        } else {
          console.log('Error fetching quiz data:', data.error);
        }
      } catch (error) {
        console.log('Error fetching quiz data:', error);
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
      progress.questionnaireCompleted === 1, // Questionnaire
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
        <h1 className="text-4xl font-bold text-white-500 mb-2">Progression du Cours "{session?.user?.fullName.toUpperCase()}"</h1>
        <p className="text-black-500 mb-4">Suivez votre parcours d'apprentissage</p>

        <ProgressBar progress={overallProgress} />

        <div className="bg-white-500 shadow-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-black-600 mb-6">Statut de Complétion</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgressItem
              icon={BookOpen}
              title="Vidéos Regardées"
              value={`${progress.videosCompleted}/2`}
              completed={progress.videosCompleted === 2}
            />
            <ProgressItem
              icon={BarChart2}
              title="Performance du Quiz"
              value={progress.quizPassed ? 'Réussi' : 'Non Passé'}
              completed={progress.quizPassed}
            />
            <ProgressItem
              icon={CheckCircle}
              title="Questionnaire"
              value={progress.questionnaireCompleted ? 'Complété' : 'En Attente'}
              completed={progress.questionnaireCompleted}
            />
            <ProgressItem
              icon={Download}
              title="Attestation du Cours"
              value={gotAttestation ? 'Téléchargé' : 'Pas Téléchargé'}
              completed={gotAttestation}
            />
          </div>
        </div>

        {/* Section d'accès au contenu */}
        <div className="bg-white-500 shadow-lg rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-semibold text-black-600 mb-6">Accédez à vos Matériaux d'Apprentissage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center p-6 bg-blue-200 rounded-lg">
              <Video className="h-10 w-10 text-blue-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-black-600 mb-1">Accédez aux Vidéos</p>
                <Link href="/video" className="text-blue-500 font-bold text-xl">
                  Visionner les vidéos
                </Link>
              </div>
            </div>
            <div className="flex items-center p-6 bg-blue-200 rounded-lg">
              <BookOpen className="h-10 w-10 text-blue-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-black-600 mb-1">Complétez le Questionnaire</p>
                <Link href="/questionnaire" className="text-blue-500 font-bold text-xl">
                  Compléter le questionnaire
                </Link>
              </div>
            </div>
            <div className="flex items-center p-6 bg-blue-200 rounded-lg">
              <BarChart2 className="h-10 w-10 text-blue-500 mr-4" />
              <div>
                <p className="text-sm font-medium text-black-600 mb-1">Passez le Quiz</p>
                <Link href="/quiz" className="text-blue-500 font-bold text-xl">
                  Passer le quiz
                </Link>
              </div>
            </div>
          </div>
        </div>

        {isDownloadButtonVisible && (
          <Link href='/attestation'>
          <Button className="w-full mt-8 text-white-500 bg-blue-500 hover:bg-blue-700">
            Télécharger l'Attestation
          </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
