import { FC } from 'react';

interface ProjectProps {
  index: number;
  title: string;
  label?: string;
  setModal: ({ active, index }: { active: boolean; index: number }) => void;
}

export const Project: FC<ProjectProps> = ({ index, title, label = 'Design & Development', setModal }) => {
  const handleMouseEnter = () => {
    setModal({ active: true, index });
  };

  const handleMouseLeave = () => {
    setModal({ active: false, index });
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group flex w-full cursor-pointer items-center justify-between border-t border-solid border-gray-700 pb-[50px] pl-[100px] pr-[100px] pt-[50px] transition-all last-of-type:border-b hover:opacity-50"
    >
      <h2 className="m-0 text-2xl transition-all group-hover:translate-x-[-10px]">{title}</h2>
      <p className="font-light transition-all group-hover:translate-x-[10px]">{label}</p>
    </div>
  );
};
