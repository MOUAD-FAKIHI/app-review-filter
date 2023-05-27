import { BrowserRouter } from 'react-router-dom';
import AppReviewsScreen from './screens/AppReviewsScreen';

function App() {
  return (
    <BrowserRouter>
      <div>
        <AppReviewsScreen />
      </div>
    </BrowserRouter>
  );
}

export default App;
