'use client';

import { useState } from 'react';

import { Project } from '@/components/project';
import { ProjectPopover } from '@/components/project-popover';

import { ProjectLibrary, ProjectModal } from '@/libs/types/project-gallery';

const projects: ProjectLibrary[] = [
  {
    title: 'C2 Montreal',
    src: 'c2montreal.png',
    color: '#000000'
  },
  {
    title: 'Office Studio',
    src: 'officestudio.png',
    color: '#8C8C8C'
  },
  {
    title: 'Locomotive',
    src: 'locomotive.png',
    color: '#EFE8D3'
  },
  {
    title: 'Silencio',
    src: 'silencio.png',
    color: '#706D63'
  }
];

export default function Page() {
  const [modal, setModal] = useState<ProjectModal>({ active: false, index: 0 });
  return (
    <div>
      {projects.map((project, index) => {
        return <Project index={index} title={project.title} setModal={setModal} key={index} />;
      })}

      <ProjectPopover modal={modal} projects={projects} />
    </div>
  );
}
