'use client';

import { useState } from 'react';

import { Project } from '@/components/project';

const projects = [
  {
    title: 'C2 Montreal',
    src: 'c2montreal.png'
  },
  {
    title: 'Office Studio',
    src: 'officestudio.png'
  },
  {
    title: 'Locomotive',
    src: 'locomotive.png'
  },
  {
    title: 'Silencio',
    src: 'silencio.png'
  }
];

export default function Page() {
  const [modal, setModal] = useState({ active: false, index: 0 });
  return (
    <div>
      {projects.map((project, index) => {
        return <Project index={index} title={project.title} setModal={setModal} key={index} />;
      })}
    </div>
  );
}
