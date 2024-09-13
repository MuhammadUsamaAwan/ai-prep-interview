import type { Feature } from '~/types';
import { Icons } from '~/components/icons';

const features: Feature[] = [
  {
    title: 'Personalized Interview Questions',
    description: 'Get tailored questions based on job title and description',
    icon: 'user',
  },
  {
    title: 'Real-Time Audio Recording',
    description: 'Record and review your responses using microphone.',
    icon: 'mic',
  },
  {
    title: 'Feedback and Ratings',
    description: 'Receive feedback and performance ratings after each interview.',
    icon: 'star',
  },
  {
    title: 'Detailed Model Answer Suggestions',
    description: 'Get model answers suggestions for each question.',
    icon: 'fileText',
  },
  {
    title: 'Interactive Simulation Environment',
    description: 'Engage in a simulation that mimics a real interview setting.',
    icon: 'package',
  },
  {
    title: 'Progress Tracking Dashboard',
    description: 'Access a dashboard to review past interviews and track your improvement.',
    icon: 'dashboard',
  },
];

export function Features() {
  return (
    <section id='features' className='container pb-10'>
      <h1 className='sr-only'>Features</h1>
      <div className='grid gap-5 md:grid-cols-2 xl:grid-cols-3'>
        {features.map(f => (
          <Feature key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}

function Feature({ title, description, icon }: Feature) {
  const Icon = Icons[icon];
  return (
    <div className='space-y-1 rounded-lg border p-4'>
      <div className='flex items-center gap-2'>
        <Icon className='size-6 shrink-0' />
        <h2 className='text-lg font-bold'>{title}</h2>
      </div>
      <div className='text-muted-foreground'>{description}</div>
    </div>
  );
}
