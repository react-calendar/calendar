import Calendar from 'src/components/calendar/calendar';
import { markers } from 'src/test';

import './styles/app.scss';

export default function App() {
  return (
    <div className="App">
      <div className="calendar">
        <Calendar markers={markers}></Calendar>
      </div>
    </div>
  );
}
