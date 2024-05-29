import { FC } from 'react';

interface PreviewBlogCardProps {
  title: string;
  description: string;
  date: string;
}

export const PreviewBlogCard: FC<PreviewBlogCardProps> = ({ date, description, title }) => {
  return (
    <div>
      <h2>{title}</h2>
      <p>{description}</p>
      <p>{date}</p>
    </div>
  );
};
