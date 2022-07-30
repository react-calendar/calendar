import Calendar from 'src/components/calendar/calendar';
import { markers } from 'src/test';

import './styles/app.scss';

function dateChange(e: DateFullType) {
  console.log(e);
}

export default function App() {
  return (
    <div className="App">
      <div className="calendar">
        <Calendar markers={markers} onDateChange={dateChange}></Calendar>
      </div>
    </div>
  );
}
