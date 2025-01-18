import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './pages/Signup';  // Default import
import Signin from './pages/Signin';  // Default import
import Dashboard  from './pages/Dashboard';
import SendMoney from './pages/SendMoney';  // Adjust path if necessary

import './App.css';
import Transactions from './pages/Transactions';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/send" element={<SendMoney />} />
          <Route path = "/transactions" element = {<Transactions/>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
