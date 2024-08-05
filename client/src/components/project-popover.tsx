import { motion } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';
import { FC, useEffect, useRef } from 'react';

import type { ProjectLibrary, ProjectModal } from '@/libs/types/project-gallery';

interface ProjectPopoverProps {
  modal: ProjectModal;
  projects: ProjectLibrary[];
}

const scaleAnimation = {
  initial: {
    scale: 0,
    x: '-50%',
    y: '-50%'
  },
  enter: {
    scale: 1,
    x: '-50%',
    y: '-50%',
    transition: { duration: 0.4, ease: [0.76, 0, 0.24, 1] }
  },
  closed: {
    scale: 0,
    x: '-50%',
    y: '-50%',
    transition: { duration: 0.4, ease: [0.32, 0, 0.67, 0] }
  }
};

export const ProjectPopover: FC<ProjectPopoverProps> = ({ projects, modal }) => {
  const { active, index } = modal;
  const modalContainer = useRef<HTMLDivElement | null>(null);
  const cursor = useRef<HTMLDivElement | null>(null);
  const cursorLabel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // move container
    let xMoveContainer = gsap.quickTo(modalContainer.current, 'left', { duration: 0.8, ease: 'power3' });
    let yMoveContainer = gsap.quickTo(modalContainer.current, 'top', { duration: 0.8, ease: 'power3' });

    //Move cursor
    let xMoveCursor = gsap.quickTo(cursor.current, 'left', { duration: 0.5, ease: 'power3' });
    let yMoveCursor = gsap.quickTo(cursor.current, 'top', { duration: 0.5, ease: 'power3' });

    //Move cursor label
    let xMoveCursorLabel = gsap.quickTo(cursorLabel.current, 'left', { duration: 0.45, ease: 'power3' });
    let yMoveCursorLabel = gsap.quickTo(cursorLabel.current, 'top', { duration: 0.45, ease: 'power3' });

    const handleMouseMove = (e: MouseEvent) => {
      const { pageX, pageY } = e;
      xMoveContainer(pageX);
      yMoveContainer(pageY);
      xMoveCursor(pageX);
      yMoveCursor(pageY);
      xMoveCursorLabel(pageX);
      yMoveCursorLabel(pageY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <motion.div
        ref={modalContainer}
        variants={scaleAnimation}
        initial="initial"
        animate={active ? 'enter' : 'closed'}
        className="h-[350px] w-[400px] absolute overflow-hidden pointer-events-none flex items-center justify-center bg-white"
      >
        <div style={{ top: index * -100 + '%' }} className="h-full w-full absolute transition-all">
          {projects.map((prod, idx) => {
            const { color, src } = prod;
            return (
              <div
                style={{ backgroundColor: color }}
                key={`modal_${idx}`}
                className="h-full w-full flex items-center justify-center"
              >
                <Image src={`/images/${src}`} width={300} height={0} className="h-auto relative z-1" alt="image" />
              </div>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        ref={cursor}
        className="w-[60px] h-[60px] rounded-full bg-[#455CE9] text-white absolute z-[2] flex items-center justify-center text-sm font-light pointer-events-none"
        variants={scaleAnimation}
        initial="initial"
        animate={active ? 'enter' : 'closed'}
      ></motion.div>

      <motion.div
        ref={cursorLabel}
        className="w-[60px] h-[60px] rounded-full bg-transparent text-white absolute z-[2] flex items-center justify-center text-sm font-light pointer-events-none"
        variants={scaleAnimation}
        initial="initial"
        animate={active ? 'enter' : 'closed'}
      ></motion.div>
    </>
  );
};
