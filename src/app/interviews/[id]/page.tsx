import { AttemptsTable } from './_components/attempts-table';
import { InterviewDetails } from './_components/interview-details';

type InterviewPageProps = {
  params: {
    id: string;
  };
};

export default function InterviewPage({ params: { id } }: InterviewPageProps) {
  return (
    <div className='container space-y-4 pb-10 pt-20'>
      <InterviewDetails id={id} />
      <AttemptsTable interviewId={id} />
    </div>
  );
}
