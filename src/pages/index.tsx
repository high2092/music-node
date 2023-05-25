import { MusicManager } from '../components/MusicManager';
import { SearchManager } from '../components/SearchManager';
import * as S from '../styles/pages/index';

function Home() {
  return (
    <S.Home>
      <S.NodeManagerSection />
      <S.UiSection>
        <S.NodeListSection>
          <MusicManager />
        </S.NodeListSection>
        <S.SearchSection>
          <SearchManager />
        </S.SearchSection>
        <S.PlayerSection />
      </S.UiSection>
    </S.Home>
  );
}

export default Home;
