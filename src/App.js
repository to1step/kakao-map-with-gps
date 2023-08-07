import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [address, setAddress] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          
          try {
            const response = await axios.get(`https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`, {
              headers: {
                Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`,
              },
            });
            let addressData = response.data.documents[0];
            if (addressData.region_1depth_name === '서울특별시') {
              addressData.region_1depth_name = '서울시';
            }
            
            const {data} = await axios.get(`https://api.to1step.shop/v1/rank?type=store&region=${addressData.region_1depth_name} ${addressData.region_2depth_name}`);

            setAddress(addressData.region_1depth_name + ' ' + addressData.region_2depth_name + ' ' + addressData.region_3depth_name);
            setData(data.data);
          } catch (error) {
            console.error('Error fetching address:', error);
          }
        },
        (error) => console.error('Error getting location:', error)
      );
    }
  }, []);

  return (
    <div>
      {address ? <p>{address}</p> : <p>Loading...</p>}
      <h2>API 호출 정보</h2>
      {data.map((item) => 
        <div key={item.uuid}>
          <p>상점 이름: {item.name}</p>
          <p>카테고리: {item.category}</p>
          <p>설명: {item.description}</p>
          <p>주소: {item.location}</p>
          <p>좌표: {item.coordinates.map(e => `${e} `)}</p>
          <img src={item.representImage} alt="representImage" />
          <div>
            {item.tags.map((tag, index) =>
              <span key={index}>{tag}. </span>
            )}
          </div>
          <p>문 여는 시간: {item.startTime}</p>
          <p>문 닫는 시간: {item.endTime}</p>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
          <hr/>
        </div>
      )}
    </div>
  );
}

export default App;
