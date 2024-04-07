import '~/styles/App.css'
import Routings from '~/routes/Routings'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <>
      <ToastContainer />
      <Routings />
    </>
  )
}

export default App
