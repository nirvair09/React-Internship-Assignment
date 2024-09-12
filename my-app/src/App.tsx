import { SelectionProvider } from './context/SelectionContext';
import ArtworksPage from './pages/ArtworksPage';

const App = () => {
   return (
      <SelectionProvider>
         <ArtworksPage />
      </SelectionProvider>
   );
};

export default App;
