import './App.css';
import RazorpayGateway from './components/razorpay/RazorpayGateway.jsx';
function App() {



  return (
    <div className="align-center flex">
      <h2> Payment Integration </h2>

      <div style={{padding:"50px"}}>
        <h3>
          RazorPay Integration (add API_KEY in frontend and add API_KEY and API_SECRET in backend Order API) 
          <RazorpayGateway/>
        </h3>
        <h3>
          Stripe Integration (will added soon)
        </h3>
      </div>
    </div>
  )
}

export default App
