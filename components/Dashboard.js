'use client';

import { useState, useEffect } from 'react';
import { BarChart2, BookOpen, CheckCircle, Download, Video } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [gotAttestation, setGotAttestation] = useState(false);
  const [progress, setProgress] = useState({
    videosCompleted: 0,
    quizPassed: false,
    questionnaireCompleted: false,
  });

  useEffect(() => {
    if (status === 'loading' || !session?.user?.email) return;

    const email = session.user.email;

    // Fire all 4 fetches in parallel instead of sequentially
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [videoRes, questionnaireRes, quizRes, certRes] = await Promise.all([
          fetch(`/api/video?email=${encodeURIComponent(email)}`),
          fetch(`/api/questionnaire?email=${encodeURIComponent(email)}`),
          fetch(`/api/score?email=${encodeURIComponent(email)}`),
          fetch(`/api/certinfo?email=${encodeURIComponent(email)}`),
        ]);

        const [videoData, questionnaireData, quizData, certData] = await Promise.all([
          videoRes.json(),
          questionnaireRes.json(),
          quizRes.json(),
          certRes.json(),
        ]);

        const videosCompleted =
          (videoData?.videoStatus?.video1Status === 'Regarde' ? 1 : 0) +
          (videoData?.videoStatus?.video2Status === 'Regarde' ? 1 : 0);

        const questionnaireCompleted =
          questionnaireData?.success &&
          Object.values(questionnaireData.userData).every((v) => v !== null);

        const quizPassed =
          quizData?.success && (quizData?.userData?.score ?? 0) >= 7;

        setProgress({ videosCompleted, quizPassed, questionnaireCompleted });
        setGotAttestation(certData?.gotAttestation ?? false);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [session, status]);

  const overallProgress = () => {
    const steps = [
      progress.videosCompleted === 2,
      progress.quizPassed,
      progress.questionnaireCompleted,
      gotAttestation,
    ];
    return Math.round((steps.filter(Boolean).length / steps.length) * 100);
  };

  const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-100 rounded-full h-6 mb-6 relative">
      <div
        className="bg-blue-500 h-6 rounded-full transition-all duration-500 ease-in-out"
        style={{ width: `${value}%` }}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-semibold text-white-500">{value}%</span>
      </div>
    </div>
  );

  const ProgressItem = ({ icon: Icon, title, value, completed }) => (
    <div
      className={`flex items-center p-6 rounded-lg transition-all ${
        completed ? 'bg-blue-500 text-white-500' : 'bg-white text-black-500'
      }`}
    >
      <Icon className={`h-10 w-10 ${completed ? 'text-white-500' : 'text-blue-500'} mr-4`} />
      <div>
        <p className={`text-sm font-medium ${completed ? 'text-white-500' : 'text-black-500'} mb-1`}>
          {title}
        </p>
        <p className={`text-2xl font-bold ${completed ? 'text-white-500' : 'text-blue-500'}`}>
          {value}
        </p>
      </div>
      {completed && <CheckCircle className="h-6 w-6 text-white-500 ml-auto" />}
    </div>
  );

  const isDownloadVisible =
    progress.videosCompleted === 2 && progress.quizPassed && progress.questionnaireCompleted;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-white-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white-500 mb-2">
          Training Progress &quot;{session?.user?.fullName?.toUpperCase()}&quot;
        </h1>
        <p className="text-black-500 mb-4">Follow your learning journey!</p>

        {loading ? (
          <div className="w-full bg-gray-100 rounded-full h-6 mb-6 animate-pulse" />
        ) : (
          <ProgressBar value={overallProgress()} />
        )}

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

        {isDownloadVisible && (
          <Link href="/attestation">
            <Button className="w-full mt-8 text-white-500 bg-blue-500 hover:bg-blue-700">
              Download the Certificate
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
