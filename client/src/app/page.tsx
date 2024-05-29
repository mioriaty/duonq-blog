import { ThemeSwitcher } from '@/components/theme-switcher';
import Image from 'next/image';

export default async function HomePage() {
  return (
    <div className="container">
      <ThemeSwitcher />
      <Image
        src={
          'https://images.pexels.com/photos/7566369/pexels-photo-7566369.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        }
        fill={true}
        alt=""
      />
    </div>
  );
}
