import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Helload from "../components/Helload";
import ApiService from "../api/ApiService";
import ShowData from "../components/ShowData";

const isChoseongOnly = (string) => {
  return /^[ㄱ-ㅎ]+$/g.test(string);
};

function Search() {
    const searchValue = useSelector((state) => state.search.value);
    const [visiblevodData1, setVisiblevodData1] = useState([]);
    const [visiblevodData2, setVisiblevodData2] = useState([]);
    const [isShow1, setIsShow1] = useState(true);
    const [isShow2, setIsShow2] = useState(true);
    const itemsPerpage = 12;
    const [movies, setMovie] = useState([]);
    const [actormovies, setActorMovie] = useState([]);
    useEffect(() => {
      if (searchValue !== undefined && searchValue !== null && searchValue !== "") {
        getData(searchValue);
        // setVisiblevodData1(movies.slice(0, itemsPerpage));
        // setVisiblevodData2(actormovies.slice(0, itemsPerpage));
      }
    }, [searchValue]);
  
    useEffect(() => {
      setVisiblevodData1(movies.slice(0, itemsPerpage));
    }, [movies]);
    useEffect(() => {
      setVisiblevodData2(actormovies.slice(0, itemsPerpage));
    }, [actormovies]);
    // console.log("영화개수",movies.length)
    // console.log("보이는 영화",visiblevodData1.length)
    // console.log("배우개수",actormovies.length)
    // console.log("보이는 배우",visiblevodData2)
    useEffect(() => {
      // 남은 데이터가 없을 경우 isShow를 false로 설정
      if ((movies.length - visiblevodData1.length) <= 0) {
        setIsShow1(false);
      } else {
        setIsShow1(true);
      }
    }, [visiblevodData1, searchValue]);
  
    useEffect(() => {
      // 남은 데이터가 없을 경우 isShow를 false로 설정
      if ((actormovies.length - visiblevodData2.length) <= 0) {
        setIsShow2(false);
      } else {
        setIsShow2(true);
      }
    }, [visiblevodData2, searchValue]);
  
    const getData = async (searchValue1) => {
      console.log(searchValue1)
      try {
        let response;
        let responseactor;
    
        console.log("getData", searchValue1);
    
        if (isChoseongOnly(searchValue1)) {
          try {
            response = await ApiService.getSearch1(searchValue1); // 초성검색
            setMovie(response.data);
            console.log("초성 검색 성공")
          } catch (err) {
            console.error("초성 검색 오류:", err);
          }
        } else {
          try {
            response = await ApiService.getSearch2(searchValue1); // 제목검색
            setMovie(response.data);
            console.log("제목 검색 성공")
          } catch (err) {
            console.error("제목 검색 오류:", err);
          }
    
          try {
            responseactor = await ApiService.getSearch3(searchValue1); // 인물검색
            setActorMovie(responseactor.data);
            console.log("배우 검색 성공")
          } catch (err) {
            console.error("인물 검색 오류:", err);
          }
        }
    
      } catch (err) {
        console.error("데이터 로딩 오류:", err);
      }
    };
  
    const handleShowMorevodData1 = () => {
      const newDataToShow = movies.slice(
        visiblevodData1.length,
        visiblevodData1.length + itemsPerpage
      );
      setVisiblevodData1([...visiblevodData1, ...newDataToShow]);
      console.log("New visible data (1):", newDataToShow);
    };
    const handleShowMorevodData2 = () => {
      const newDataToShow = actormovies.slice(
        visiblevodData2.length,
        visiblevodData2.length + itemsPerpage
      );
      setVisiblevodData2([...visiblevodData2, ...newDataToShow]);
      console.log("New visible data (2):", newDataToShow);
    };
  if (searchValue === undefined) {
    return (
      <div className="mx-28 mt-5 text-gray-300">
        <h1>검색어를 입력해주세요</h1>
        <Helload />
      </div>
    );
  } else {
    return (
      <div className="mx-28  mt-5 text-gray-300">
        <h1>검색 결과 : {searchValue}</h1>

        <div className="mt-5 font-bold">
          <h3>제목 검색</h3>
          {movies.length === 0 ? (
            <p className="text-lg"> 제목 검색 결과가 없습니다</p>
          ) : (
            <ShowData
              data={visiblevodData1}
              handleShow={handleShowMorevodData1}
              isShow={isShow1}
            />
          )}
        </div>

        <div className="my-5 pb-10 font-bold">
          <h3>인물 검색</h3>
          {actormovies.length === 0 ? (
            <p className="text-lg"> 인물 검색 결과가 없습니다</p>
          ) : (
            <ShowData
              data={visiblevodData2}
              handleShow={handleShowMorevodData2}
              isShow={isShow2}
            />
          )}
        </div>
      </div>
    );
  }
}
export default Search;