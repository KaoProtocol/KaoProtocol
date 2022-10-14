import React, {useState, useEffect} from 'react'
import './App.css';
import video from "./img/background.mp4"
import Notify from './components/Notify';
import { contractaddress, contractABI, chainID } from "./utils/constants";
import { ethers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";


function App() {


  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("");
  const [notificationMessage, setNotificationMessage] = useState("");
  const [provider, setProvider] = useState();
  const [address, setAddress] = useState();
  const [instanceonchange, setInstancesetonchange] = useState();
  const [totalMinted, setTotalminted] = useState();
  const [tokenbalance, setTokenBalance] = useState();
  const [member, setMember] = useState();

  const { ethereum } = window;

        /* global BigInt */



  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };




  //set provider pc 
  const setProviderWindow = async () => {
    const temporalProvider = await new ethers.providers.Web3Provider(window.ethereum);
    setProvider(temporalProvider);
  }





    //check for correct chain
    const updateAccountChain = async () => {

    console.log("in here");

        console.log("called");

        await ethereum.request({ method: "eth_requestAccounts" });

        const chainId = await provider.getNetwork();
        //console.log(chainId.chainId);
        if (chainId.chainId !== chainID) {

          console.log("still trying");

          try {
            //switch chain
            await window.ethereum.request({
              method: "wallet_switchEthereumChain",
              params: [
                {
                  chainId: `0x${Number(97).toString(16)}`,
                }],
            });

            connectWallet();
            
          } catch (error) {
            if (error === 4902) {
              //add the token or currency to metamask
              await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: `0x${Number(97).toString(16)}`,
                    rpcUrls: [
                      " https://data-seed-prebsc-1-s1.binance.org:8545",
                    ],
                    chainName: "BSC testnet",
                    nativeCurrency: {
                      name: "BSC",
                      symbol: "BNB",
                      decimals: 18,
                    },
                    blockExplorerUrls: [
                      "https://explorer.binance.org/smart-testnet",
                    ],
                  },
                ],
              });

              connectWallet();
            }
          }
        } else if (chainId.chainId === chainID) {
           console.log("Correct chain");
        }


  };






//connect wallet mobile devices
  const connectWalletmobile = async () => {


    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider, // required
        options: {
          rpc: {
            97: "https://testnet.bscscan.com/",
          }, // required
          network: 'bsc testnet',
          chainId: 97,
        }
      },
    };



    const web3Modal = new Web3Modal({
      network: "binance", // optional
      cacheProvider: true, // optional
      providerOptions, // required
    });
    

    const instance = await web3Modal.connect();

    //setgetInstance(instance); for onchange event
    setInstancesetonchange(instance);

    const gettingprovider = await new ethers.providers.Web3Provider( instance );
    setProvider(gettingprovider);


     if(provider) {


          const signer = await gettingprovider.getSigner();
          const accounts = await signer.getAddress();

          setAddress(accounts);

     }

  }






//conect wallet pc
  const connectWallet = async () => {
      
      console.log("Caling");
      console.log(provider);
      const chainId = await provider.getSigner().getChainId();

        if(provider){
          

          if( !address || chainID !== chainId) {
            console.log("run");
            updateAccountChain();
          } 


          if (chainId === chainID) {
            //console.log("called twice");
            const signer = await provider.getSigner();
            const accounts = await signer.getAddress();

            setAddress(accounts);

          } else {
            // alert("Wrong Chain Switch");
            updateAccountChain();
          }





      }
  }




  const getContract = async () => {
    //console.log("bad guy called");
    const signer = await provider.getSigner();
    return new ethers.Contract(contractaddress, contractABI, signer);
  }



  //get balance
  const getBalance = async () => {

    //check if wallet is connected
      console.log("called balance");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      let val =  String( await provider.getBalance("0x71D14752Dc1b92121171B1c2719440b2560F8bc0") );
      setTokenBalance(val);

  };




  const getvalues = async () => {
    
    const Contract = await getContract();
    const totalminted = await Contract.totalSupply();

    setTotalminted(BigInt( String(totalminted) ));

    const checkmember = await Contract.balanceOf(address);
    setMember(checkmember);

  }



  const mint = async () => {
    console.log("Helloo here");

    if(!address) {
        setOpen(true);
        setSeverity("error");
        setNotificationMessage("Connect wallet to proceede");
        return;
    }


    const Contract = await getContract();
    await Contract.mint();

  }




  useEffect(() => {

    setProviderWindow();

    if(address) {
      getvalues();
    }

    getBalance();

  }, [address])






  return (

    <div className="App">


      <div className="vid-container">
    
          <video  src={video} loop autoPlay id="background-video"></video>

      </div>


      <div className="body-container">


              <div className="divone">

                {!address ? 

                 <div className="connectwallet" onClick={ window.ethereum ?  connectWallet :  connectWalletmobile } >
                        Connect <br />
                      <div className='red'>Button</div>
                  </div>

                  :

                  <div className="minterinfo">

                     <div className="containaddress">
                        <address className='address' >Address</address>
                        {address}
                     </div>

                     <div className="containaddress">
                        <div className="icon">
                          Icon
                        </div>
                         { member != 0 ? "Member" : "Not a Member" }
                     </div>

                  </div>
                
                 }



              </div>



              <div className="divtwo">
              

                  <div className="contractbalance">{ tokenbalance ? tokenbalance : "0" }Eth</div>

                  <div className="totalminted">{ totalMinted ? totalMinted : "0" }/5000 Minted</div>

                  <div className="mintbutton" onClick={ mint }>
                    Mint <br />
                    <div className='redtwo'>Button</div>
                  </div>
                

              </div>



          </div>


          <div className='notifycontain'>
            <Notify open={open} handleClose={handleClose} severity={severity} notificationMessage={notificationMessage} />
          </div>


      </div>
  );
}

export default App;
