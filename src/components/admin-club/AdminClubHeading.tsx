import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Image from 'next/image';
import ImageInput from '@/assets/imageInput.svg';
import Write from '@/assets/write.svg';
import type { DeptCaptionColor } from '@/types';
import { ClubDetail } from '@/types/club';

const deptCaptionColor: DeptCaptionColor = {
  봉사: 'text-pink-500',
  사회연구: 'text-orange-500',
  연행예술: 'text-yellow-500',
  전시창작: 'text-emerald-500',
  종교: 'text-cyan-500',
  체육: 'text-blue-500',
  학술: 'text-purple-500',
};

type AdminClubHeadingProps = {
  clubName: string;
  category: string;
  tag: string;
  uploadFiles: File | null;
  setValue: Dispatch<SetStateAction<ClubDetail>>;
};

export default function AdminClubHeading({
  clubName,
  category,
  tag,
  uploadFiles,
  setValue,
}: AdminClubHeadingProps) {
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setValue((prev) => ({ ...prev, uploadFiles: file }));
    }
  }
  useEffect(() => {
    if (uploadFiles) {
      const imageUrl = URL.createObjectURL(uploadFiles);
      setPreviewImageUrl(imageUrl);
      return () => {
        URL.revokeObjectURL(imageUrl);
      };
    } else {
      setPreviewImageUrl(null);
    }
  }, [uploadFiles]);
  function handleImageReset() {
    setValue((prev) => ({
      ...prev,
      uploadFiles: null,
    }));
  }
  return (
    <>
      <div className=" relative flex flex-row items-center">
        {uploadFiles ? (
          <>
            <Image
              src={previewImageUrl || ''}
              width={100}
              height={100}
              alt="image"
              className="m-auto rounded-full object-cover md:h-24 md:w-24"
            />
            <div className="absolute start-20 top-0.5">
              <Image
                src={Write}
                width={20}
                height={20}
                className=" cursor-pointer opacity-40"
                onClick={handleImageReset}
                alt="재사용"
              />
            </div>
          </>
        ) : (
          <label
            htmlFor="uploadFiles"
            className=" text-md flex h-20 w-20 cursor-pointer items-center justify-center rounded-full border border-gray-200 bg-white p-3 font-medium text-gray-300 outline-none md:h-24 md:w-24"
          >
            <div className="flex flex-col items-center px-4 py-2.5  outline-none md:px-5">
              <Image src={ImageInput} width={35} height={35} alt="사진 선택" />
            </div>
            <input
              id="uploadFiles"
              name="uploadFiles"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
        <div className=" ml-4 text-base">
          <div className="rounded-lg text-xl font-semibold md:text-3xl">
            {clubName} 이름
          </div>
          <div className="flex items-center md:mt-0.5">
            <div
              className={`rounded-lg text-sm font-semibold md:text-lg ${deptCaptionColor[category]}`}
            >
              {category} 카ㅔㅌ고리
            </div>
            <div className="px-1.5 text-sm font-medium text-gray-300 md:text-lg">
              |
            </div>
            <div className="rounded-lg text-sm font-semibold text-gray-500 md:text-lg">
              {tag} 태그
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
