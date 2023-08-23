import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next/types';
import { useCookies } from 'react-cookie';
import Clean from '@/assets/clean.svg';
import Dot from '@/assets/dot.svg';
import People from '@/assets/people.svg';
import Report from '@/assets/report.svg';
import Report2 from '@/assets/report2.svg';
import Heading from '@/components/common/Heading';
import History from '@/components/common/History';
import ScoreCategory from '@/components/common/ScoreCategory';
import { ROLE_TYPE } from '@/constants/text';
import { useAllScore } from '@/hooks/api/score/useAllScore';
import { ScoreDetail } from '@/types/score';

type ScoreProps = {
  clubId: number;
};
export default function Index({ clubId }: ScoreProps) {
  const key = [
    { icon: Report, category: '동아리 활동 보고서' },
    { icon: Clean, category: '청소' },
    { icon: People, category: '전동대회' },
    { icon: Report2, category: '총동연 사업 참여' },
    { icon: Dot, category: '가산점/감점' },
  ];
  const parseList = [];
  const initialValue = 0;
  const [{ role, token }] = useCookies(['token', 'role']);
  const [scoreData, setScoreData] = useState<ScoreDetail[]>([
    {
      scoreCategory: '',
      reason: '',
      createdAt: '',
      amount: 0,
      remainingScore: 0,
    },
  ]);
  const {
    data: { data },
  } = useAllScore(token, clubId);

  useEffect(() => {
    if (data) {
      data.reverse();
      setScoreData(data);
      console.log('데이터', scoreData);
    }
  }, [data]);

  function Category(categoryName: string) {
    const category: ScoreDetail[] = [];
    scoreData.map((item) => {
      if (item.scoreCategory === categoryName) category.push(item);
    });
    const score = totalScore(category);
    parseList.push({ category: category, score: score });
    return category;
  }
  function totalScore(category: Array<ScoreDetail>) {
    const total = category.reduce((acc, cur) => acc + cur.amount, 0);
    return total;
  }
  const isAdmin = role === ROLE_TYPE.ROLE_ADMIN;

  return (
    <div className="">
      {isAdmin ? (
        <Heading>동아리 점수 관리하기</Heading>
      ) : (
        <Heading>동아리 점수 확인하기</Heading>
      )}
      <History scoreData={scoreData} />
      <div className="mb-3 flex w-full flex-col items-center justify-between p-5 md:h-50 md:flex-row md:space-x-5 md:p-4">
        {key.map(({ icon, category }) => (
          <ScoreCategory
            key={category}
            scoreCategory={category}
            icon={icon}
            amount={totalScore(Category(category))}
            clubId={clubId}
          />
        ))}
        {/* <ScoreCategory
          scoreCategory="청소"
          icon={Clean}
          amount={30}
          clubId={clubId}
        />
        <ScoreCategory
          scoreCategory="동아리 활동 보고서"
          icon={Report}
          amount={30}
          clubId={clubId}
        />
        <ScoreCategory
          scoreCategory="전동대회"
          icon={People}
          amount={30}
          clubId={clubId}
        />
        <ScoreCategory
          scoreCategory="총동연 사업 참여"
          icon={Report2}
          amount={30}
          clubId={clubId}
        />
        <ScoreCategory
          scoreCategory="가산점/감점"
          icon={Dot}
          amount={30}
          clubId={clubId}
        /> */}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  return {
    props: {
      clubId: id,
    },
  };
};
