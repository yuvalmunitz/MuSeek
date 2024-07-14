// // Home.jsx
// import React, { useState, useContext } from 'react';
// import Topbar from "../../components/topbar/Topbar";
// import Feed from '../../components/HomeComponents/feed/Feed';
// import Rightbar from "../../components/rightbar/Rightbar";
// import styled from 'styled-components';
// import { AuthContext } from '../../firestore/AuthContext';

// const HomeContainer = styled.div`
//   display: flex;
//   width: 100%;
//   background-color: #f5f5f5;
// `;

// function Home() {
//   const { currentUser } = useContext(AuthContext);
//   const [showFavorites, setShowFavorites] = useState(false);

//   const openFavorites = () => {
//     setShowFavorites(true);
//   };

//   const closeFavorites = () => {
//     setShowFavorites(false);
//   };

//   return (
//     <>
//       <Topbar />
//       <UserInfo>
//         {currentUser && (
//           <>
//             <UserImage src={currentUser.photoURL} alt={`${currentUser.displayName}'s profile`} />
//             <span>{currentUser.displayName}</span>
//           </>
//         )}
//       </UserInfo>
//       <HomeContainer>
//         <Feed 
//           showFavorites={showFavorites} 
//           setShowFavorites={setShowFavorites} 
//           closeFavorites={closeFavorites}
//         />
//         <Rightbar openFavorites={openFavorites} />
//       </HomeContainer>
//     </>
//   );
// }

// export default Home;



import React, { useState, useEffect } from 'react';
import Topbar from "../../components/topbar/Topbar";
import Feed from '../../components/HomeComponents/feed/Feed';
import Rightbar from "../../components/rightbar/Rightbar";
import styled from 'styled-components';
import { useAuth } from '../../firestore/AuthContext';

const HomeContainer = styled.div`
  display: flex;
  width: 100%;
  background-color: #f5f5f5;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const UserImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
`;
function Home() {
  console.log('Home component rendering');
  const { currentUser } = useAuth();
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    console.log('Current user:', currentUser);
  }, [currentUser]);

  const openFavorites = () => {
    setShowFavorites(true);
  };

  const closeFavorites = () => {
    setShowFavorites(false);
  };

  if (!currentUser) {
    console.log('No current user');
    return <div>Loading...</div>;
  }

  return (
    <>
      <Topbar />
      <UserInfo>
        {currentUser && (
          <>
            <UserImage src={currentUser.photoURL} alt={`${currentUser.displayName}'s profile`} />
            <span>{currentUser.displayName}</span>
          </>
        )}
      </UserInfo>
      <HomeContainer>
        <Feed
          showFavorites={showFavorites}
          setShowFavorites={setShowFavorites}
          closeFavorites={closeFavorites}
        />
        <Rightbar openFavorites={openFavorites} />
      </HomeContainer>
    </>
  );
}

export default Home;