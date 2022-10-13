import logo from './logo.svg';
import './App.css';
import video from "../src/img/background.mp4"

function App() {
  return (


  <div className="App">

      <div className="App-container">

            <video loop autoPlay id="background-video">
              <source
                src={video}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

      </div>



     <div className="body-container">


            <div className="divone">

                <div className="connectwallet">
                    Connect <br />
                     <div className='red'>Button</div>
                </div>

            </div>



            <div className="divtwo">
            

                <div className="contractbalance">0.2Eth</div>

                <div className="totalminted">500/1000 Minted</div>

                <div className="mintbutton">
                   Mint <br />
                   <div className='redtwo'>Button</div>
                </div>
              

            </div>



        </div>




    </div>
  );
}

export default App;
