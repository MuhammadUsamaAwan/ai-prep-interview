'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { useMutation, useQuery } from 'convex/react';
import { Volume2Icon } from 'lucide-react';
import Webcam from 'react-webcam';

import { api } from '~/convex/_generated/api';
import { showErrorMessage } from '~/lib/utils';
import { Button } from '~/components/ui/button';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';
import { Spinner } from '~/components/spinner';

type InterviewProps = {
  id: string;
};

export function Interview({ id }: InterviewProps) {
  const [isPending, startTransition] = useTransition();
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>();
  const [response, setResponse] = useState('');
  const [mediaLoaded, setMediaLoaded] = useState(true);
  const [isRecording, setIsRecording] = useState(false);

  const attempt = useQuery(api.queries.interviewAttempt, { id });
  const interview = useQuery(api.queries.interview, { id: attempt?.interviewId });
  const questions = useQuery(api.queries.questionsByInterview, {
    interviewId: attempt?.interviewId,
  });
  const submitAnswer = useMutation(api.mutations.submitAnswer);

  const recognition = useMemo(() => {
    if (typeof window === 'undefined') return null;
    return new webkitSpeechRecognition() ?? new SpeechRecognition();
  }, []);

  const synth = typeof window === 'undefined' ? null : window.speechSynthesis;
  let currentQuestion = attempt ? questions?.[attempt.currentQuestionIndex] : null;

  useEffect(() => {
    function getVoices() {
      if (!synth) return;
      setVoices([...synth.getVoices()]);
      setSelectedVoice(synth.getVoices()[0]?.name);
    }
    if (synth?.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = getVoices;
    }
  }, [synth, synth?.onvoiceschanged]);

  useEffect(() => {
    if (!recognition) return;
    recognition.interimResults = true;
    recognition.continuous = true;
    recognition.addEventListener('result', e => {
      const text = Array.from(e.results)
        .map(result => result[0])
        .map(result => result?.transcript)
        .join('');
      setResponse(text);
    });
    return () => recognition.removeEventListener('result', () => {});
  }, [recognition]);

  function speak(text: string) {
    if (!synth) return;
    const voice = voices.find(voice => voice.name === selectedVoice);
    if (!voice) return;
    if (synth.speaking) {
      synth.cancel();
    } else {
      const speakText = new SpeechSynthesisUtterance(text);
      speakText.voice = voice;
      synth.speak(speakText);
    }
  }

  function record() {
    if (!recognition) return;
    setIsRecording(true);
    recognition.start();
  }

  function stop() {
    if (!recognition) return;
    setIsRecording(false);
    recognition.stop();
  }

  if (!attempt || !questions) {
    return <Spinner />;
  }

  return (
    <div className='flex flex-col items-start gap-6 sm:flex-row'>
      <div className='w-full flex-1'>
        <div className='relative mb-6 h-56 sm:h-96'>
          <Webcam className='size-full rounded-xl border' onUserMediaError={() => setMediaLoaded(false)} />
          {!mediaLoaded && (
            <span className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-lg font-semibold'>
              Camera Failed
            </span>
          )}
        </div>
        <div className='my-4 flex justify-center'>
          {!isRecording ? (
            <Button onClick={record}>Record Response</Button>
          ) : (
            <Button onClick={stop} variant='destructive'>
              Stop Recording
            </Button>
          )}
        </div>
        <div className='space-y-1'>
          <Label htmlFor='response'>Your Response</Label>
          <Textarea id='response' rows={4} value={response} onChange={e => setResponse(e.target.value)} />
        </div>
      </div>
      <div className='flex-1'>
        <div className='space-y-3 rounded-xl border p-4 shadow'>
          <div>
            <span className='font-semibold'>Question #:</span> {attempt.currentQuestionIndex + 1}
          </div>
          <div>{currentQuestion?.content}</div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => {
                speak(currentQuestion?.content ?? '');
              }}
            >
              <Volume2Icon className='size-5 text-muted-foreground' />
            </button>
            <Select value={selectedVoice} onValueChange={setSelectedVoice}>
              <SelectTrigger>
                <SelectValue className='overflow-hidden' />
              </SelectTrigger>
              <SelectContent>
                {voices.map(v => (
                  <SelectItem key={v.name} value={v.name}>
                    {v.name} ({v.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className='mt-4 flex justify-center'>
          <Button
            disabled={response === ''}
            isLoading={isPending}
            onClick={async () => {
              startTransition(async () => {
                try {
                  if (!attempt || !interview || !currentQuestion) return;
                  const isLastQuestion = questions.at(-1)?._id === currentQuestion._id;
                  await submitAnswer({
                    interviewId: interview._id,
                    questionId: currentQuestion._id,
                    interviewAttemptId: attempt._id,
                    content: response,
                    isLastQuestion,
                  });
                  setResponse('');
                  if (!isLastQuestion) {
                    currentQuestion = questions[attempt.currentQuestionIndex + 1];
                  }
                } catch (error) {
                  showErrorMessage(error);
                }
              });
            }}
          >
            Submit Response
          </Button>
        </div>
      </div>
    </div>
  );
}
