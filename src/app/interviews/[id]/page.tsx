import { AttemptsChart } from './_components/attempts-chart';
import { AttemptsTable } from './_components/attempts-table';
import { InterviewDetails } from './_components/interview-details';

type InterviewPageProps = {
  params: {
    id: string;
  };
};

export default function InterviewPage({ params: { id } }: InterviewPageProps) {
  return (
    <div className='container space-y-6 pb-10 pt-20'>
      <InterviewDetails id={id} />
      <AttemptsTable interviewId={id} />
      <AttemptsChart interviewId={id} />
    </div>
  );
}
