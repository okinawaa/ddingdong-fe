import { useEffect, useState } from 'react';
import { useCookies } from 'react-cookie';
import { useDeleteClub } from '@/hooks/api/club/useDeleteClub';
import { useUpdateClub } from '@/hooks/api/club/useUpdateClub';
type ModifyModalProp = {
  setShowModal: {
    modify: (flag: boolean) => void;
    delete: (flag: boolean) => void;
  };
  club: {
    score: number;
    id: number;
    name: string;
  };
};

export default function ModifyClub({ club, setShowModal }: ModifyModalProp) {
  const { id, score } = club;
  const updateMutation = useUpdateClub();
  const [cookies] = useCookies(['token']);
  const [changedScore, setScore] = useState(score);

  function handleClickChange() {
    updateMutation.mutate({ id, score: changedScore, token: cookies.token });
    setShowModal.modify(false);
  }

  function handleClickDelete() {
    // deleteMutation.mutate({
    //   clubId: id,
    //   token: cookies.token,
    // });
    setShowModal.modify(false);
    setShowModal.delete(true);
  }

  useEffect(() => {
    setScore(score);
  }, [score]);

  return (
    <>
      <form
        className="mx-auto flex w-[90%] flex-col"
        onSubmit={handleClickChange}
      >
        <div className="mb-3 w-full">
          <label className="inline-block w-20 font-semibold text-gray-500">
            점수
          </label>
          <input
            name="score"
            type="number"
            value={changedScore}
            className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-2.5 outline-none"
            onChange={(e) => {
              setScore(Number(e.target.value));
              console.log(changedScore);
            }}
          />
        </div>
        <button
          type="submit"
          className="mt-8 w-full rounded-xl bg-blue-500 py-4 font-bold text-white transition-colors hover:bg-blue-600 sm:py-4 sm:text-lg md:mt-14"
        >
          동아리 정보 수정하기
        </button>
        <div
          className="mt-3 text-center text-sm font-medium text-gray-500"
          onClick={handleClickDelete}
        >
          동아리를 삭제하시겠습니까?
        </div>
      </form>
    </>
  );
}
