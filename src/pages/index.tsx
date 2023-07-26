import { useEffect, useState } from 'react';
import ClubCard from '@/components/home/ClubCard';
import SearchBar from '@/components/home/SearchBar';
import Slider from '@/components/home/Slider';
import { useAllClubs } from '@/hooks/api/club/useAllClubs';
import type { Club } from '@/types/club';

export default function Home() {
  const [keyword, setKeyword] = useState<string>('');
  const [clubs, setClubs] = useState<Array<Club>>([]);
  const [filteredClubs, setFilteredClubs] = useState<Array<Club>>([]);
  const { isError, data } = useAllClubs();

  useEffect(() => {
    setClubs(data?.data ?? []);
    setFilteredClubs(data?.data ?? []);
  }, [data]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setFilteredClubs(
        clubs.filter(
          (club) =>
            club.name.includes(keyword.toUpperCase()) ||
            club.tag.includes(keyword) ||
            club.category === keyword,
        ),
      );
    }, 300);

    return () => clearTimeout(timeout);
  }, [clubs, keyword]);
  console.log(clubs);
  if (isError) {
    return <div>error</div>;
  }

  return (
    <>
      <div className="mb-1.5 text-sm font-semibold md:mb-2 md:text-base">
        <Slider />
      </div>
      <SearchBar value={keyword} onChange={setKeyword} />
      <div className="mb-1.5 text-sm font-semibold text-gray-500 md:mb-2 md:text-base">
        총 {filteredClubs.length}개의 동아리
      </div>
      <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {filteredClubs.map((club) => (
          <ClubCard
            key={club.id}
            id={club.id}
            name={club.name}
            category={club.category}
            tag={club.tag}
            isRecruit={club.isRecruit}
          />
        ))}
      </ul>
    </>
  );
}
