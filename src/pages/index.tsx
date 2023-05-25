import * as S from '../styles/pages/index';

function Home() {
  return (
    <S.Home>
      <S.NodeManagerSection />
      <S.UiSection>
        <S.NodeListSection />
        <S.SearchSection />
        <S.PlayerSection />
      </S.UiSection>
    </S.Home>
  );
}

export default Home;
