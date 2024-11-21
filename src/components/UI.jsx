import { isHost, myPlayer } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";
import { useEffect, useState } from "react";
import { useControls } from 'leva';
import './styles.css';
import Modal from './Modal';
import HeartDisplay from "./HeartDisplay";
import './chat.css';
import './player.css'

let myRole = '';
let myTeam = '';
let ability = '';
let checkText = "";
let isAlive = true;
let killSwitch = 0;
let gameEnd = false;
const MAX_ACTIONS_PER_ROUND = 1;
let actionsPerRound = 0;


export const UI = () => {

  const fixedButtonStyle = {
    
  };

    const {phase, timer, players, round, actionSucces, blueTeam, redTeam, externSetRedTeam, externSetBlueTeam
      , chatMessages, setChatMessages, gameEnd, gameEndVar, winnerTeam, startGame} = useGameEngine();

    const me = myPlayer();

    

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalOpenGameRules, setIsModalOpenGameRules] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const openModalGameRules = () => setIsModalOpenGameRules(true);
    const closeModalGameRules = () => setIsModalOpenGameRules(false);


    const [messages, setMessages] = useState([]); // To store the chat messages
    const [input, setInput] = useState(''); // To store the current input

    for(let i = 0; i < players.length; i++) {
        if(players[i].id == me.id) {
            isAlive = players[i].getState("isAlive");
            
            //console.log(players[i]);
        }
        //console.log(players[i]?.state?.profile?.name + ' ' + players[i].getState("isAlive"));
    }
    
    const sendMessage = () => {
      if (input.trim()) {
 
        setMessages([...messages, { text: input, sender: 'You' }]); // Add your message to the list
        setChatMessages([...chatMessages, { text: input, sender: me?.state?.profile?.name }]); // Add your message to the list
        setInput(''); // Clear the input field
  
        // Simulating a response message
        
      }
    };
  
    
    useEffect(() => {
      for(let i = 0; i < redTeam.length; i++) {
        if(redTeam[i].player.id == me.id) {
          
            myRole = redTeam[i].role;
            myTeam = 'Red';

        }
    }
    for(let i = 0; i < blueTeam.length; i++) {
        if(blueTeam[i].player.id == me.id) {
            myRole = blueTeam[i].role;
            myTeam = 'Blue';
        }
    }

    if(myRole == 'Soldier') {
        ability = 'Role';
    }
    if(myRole == 'Spy') {
        ability = 'Health';
    }
    if(myRole == 'Commander') {
        ability = 'Team';
    }

    if(phase == 'talk')
    {
        setChatMessages([]);
        setMessages([]);
    }

    actionsPerRound = 0;

    }, [blueTeam, redTeam, phase]);



    const tryToKill = (player) => {

      let me = myPlayer();
      console.log("My Role: " + me.getState('attacks'));

      if(me.getState('attacks') >= 1) {
          console.log('You have no more attacks');
          checkText = 'You have no more attacks';
          openModal();
          return;
      }

      me.setState('attacks', me.getState('attacks') + 1, true);

      let myRole = '';
      let myTeam = '';
      for(let i = 0; i < players.length; i++) {
          if(players[i].id == me.id) {
              myRole = players[i].getState('role');
              myTeam = players[i].getState('team');
          }
      }


      let playerRole = '';
      let playerTeam = '';

      let isKillable = '';
      let isKillableText = '';


      for(let i = 0; i < redTeam.length; i++) {
          if(redTeam[i].player.id == player.id) {
              playerRole = redTeam[i].role;
              playerTeam = 'Red';
          }
      }
      for(let i = 0; i < blueTeam.length; i++) {
          if(blueTeam[i].player.id == player.id) {
              playerRole = blueTeam[i].role;
              playerTeam = 'Blue';
          }
      }

      if(myRole == 'Soldier') {
          if(playerRole == 'Soldier') {
              isKillable = false;
          }else if(playerRole == 'Spy' && (playerTeam != myTeam)) {
              isKillable = true;
          }else if(playerRole == 'Commander') {
              isKillable = false;
          }else if(playerRole == 'Spy' && (playerTeam == myTeam)) {
              isKillable = false;
          }
      }

      if(myRole == 'Spy') {
        if(playerRole == 'Spy') {
          isKillable = false;
        }else if(playerRole == 'Soldier') {
          isKillable = false;
        }else if(playerRole == 'Commander' && (playerTeam != myTeam)) {
          isKillable = true;
        }else if(playerRole == 'Commander' && (playerTeam == myTeam)) {
          isKillable = false;
        }
      }

      if(myRole == 'Commander') {
        if(playerRole == 'Commander') {
          isKillable = false;
        }else if(playerRole == 'Spy') {
          isKillable = false;
        }else if(playerRole == 'Soldier' && (playerTeam != myTeam)) {
          isKillable = true;
        }else if(playerRole == 'Soldier' && (playerTeam == myTeam)) {
          isKillable = false;
        }
      }

      

      if(isKillable) {
          for(let i = 0; i < players.length; i++) {
              if(players[i].id == player.id) {
                  //players[i].setState("health", players[i].getState('health') - 1, true);
                  players[i].setState("totalDamage", players[i].getState('totalDamage') + 1, true);
                  console.log("New Health" + players[i].getState('health'));
              }
          }

          for(let i = 0; i < redTeam.length; i++) {
              if(redTeam[i].player.id == player.id) {
                  let newRedTeam = redTeam;
                  newRedTeam[i].isAlive = false;
                  externSetRedTeam(newRedTeam);
              }
          }
          for(let i = 0; i < blueTeam.length; i++) {
              if(blueTeam[i].player.id == player.id) {
                  
                  let newBlueTeam = blueTeam;
                  newBlueTeam[i].isAlive = false;
                  externSetBlueTeam(newBlueTeam);
              }
          }
      }else {
        
          isKillableText = 'You Died';

          for(let i = 0; i < players.length; i++) {
              if(players[i].id == me.id) {
                  //players[i].setState("health", players[i].getState('health') - 1, true);
                  players[i].setState("totalDamage", players[i].getState('totalDamage') + 1, true);
                  console.log("New Health" + players[i].getState('health'));
              }
          }

          
          for(let i = 0; i < redTeam.length; i++) {
              if(redTeam[i].player.id == me.id) {
                  
                  let newRedTeam = redTeam;
                  newRedTeam[i].isAlive = false;
                  externSetRedTeam(newRedTeam);

              }
          }
          for(let i = 0; i < blueTeam.length; i++) {
              if(blueTeam[i].player.id == me.id) {
                  
                  let newBlueTeam = blueTeam;
                  newBlueTeam[i].isAlive = false;
                  externSetBlueTeam(newBlueTeam);

                  
              }
          }
      }
    

    }



    const checkFunction = (player) => {
       
        if(me.getState('attacks') >= MAX_ACTIONS_PER_ROUND) {

            console.log('You have reached the maximum actions per round');
            
            checkText = 'You have reached the maximum actions per round';
            openModal();

            return;
        }

        me.setState('attacks', me.getState('attacks') + 1, true);

        checkText = "";

        let playerRole = '';
        let playerTeam = '';

        let isKillable = '';
        let isKillableText = '';

        let playerHealth = '';
        

        for(let i = 0; i < players.length; i++) {
            if(players[i].id == player.id) {
                playerRole = players[i].getState("role");
                playerTeam = players[i].getState("team");
                playerHealth = players[i].getState("health");
            }
        }

        if(myRole == 'Soldier') {  
            
            checkText = 'Player Role: ' + playerRole;
            openModal();  

        }


        if(myRole == 'Spy') {
            
            checkText = 'Player Health: ' + playerHealth;
            openModal();

        }


        if(myRole == 'Commander') {
            
            checkText = 'Player Team: ' + playerTeam;
            openModal();
            
        }

      
    }

  

    const renderPhaseContent = () => {
        return (
          
          <div className="ui-container">


           {gameEndVar === false && ( <>
            
            <header className="ui-header">
              <h1>Phase: {phase.charAt(0).toUpperCase() + phase.slice(1)}</h1>
              <p>Time Left: {timer}</p>
              <p>Round: {round}</p>
            </header>
    
            <section className="my-info">
              
              <div className="avatar-container">
                <h2>Name: {me?.state?.profile?.name}</h2>
                <img src={me?.state?.profile?.photo} alt="Avatar" class="avatar" />
              </div>
              <div class="hearts">
                
                <HeartDisplay value={me.getState("health")} />
              </div>
              <div>
              <p>Role: {myRole}</p>
              <p>Team: {myTeam}</p>
              <button onClick={openModalGameRules} className="gameRules">Game Rules</button>
              </div>
            </section>
            </>
            )}
          
            {gameEndVar === false && phase === 'talk' && isAlive && (
              <section className="players-list">
                <div class="messages">
                <h2>Chat</h2>
                
        <div>
      <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '10px' }}>
        {chatMessages.map((message, index) => (
          <div key={index}>
            <strong>{message.sender}: </strong>
            <span>{message.text}</span>
          </div>
        ))}

        </div>
        </div>
      </div>
      <div class="container">
      <div class="entryarea">
        <input
          type="text"
          required
          value={input}
          onChange={(e) => setInput(e.target.value)}
          label="Message"
          
        />
         
        
      </div>
      
      <button onClick={sendMessage} class="sendButton">
            Send
          </button>
      </div>


         
          

              </section>
            )}
        {gameEndVar === false && phase === 'action' && isAlive && (
              <section className="players-list">
                <h2>Players</h2>
                <ul>
                {players.filter(player => player.id != me.id).map((player) => (
                  <div className="player-container">
                    <li key={player.id}>
                      <span>{player?.state?.profile?.name}</span>
                      <span>Life : {player.getState("isAlive") ? "Alive" : "Dead"}</span>
                      <button onClick={() => checkFunction(player)}>Check {ability}</button>
                    </li>
                  </div>
                  ))}
                </ul>
              </section>
            )}

        {gameEndVar === false && phase === 'battle' && isAlive && ( 
              <section className="players-list">
                <h2 className="players-text">Players</h2>
                <ul>
                  {players.filter(player => player.id != me.id).map((player) => (
                    
                    <li key={player.id} className="player-container">
                      <span>{player?.state?.profile?.name}</span>
                      <img src={player?.state?.profile?.photo} alt="Avatar" class="avatar" />
                      <span>Life : {player.getState("isAlive") ? "Alive" : "Dead"}</span>
                      
                      <button onClick={() => checkFunction(player)}>Check {ability}</button>
                      <button onClick={() => tryToKill(player)}>Kill </button>
                    </li>
                    
                  ))}
                </ul>
              </section>
             )}

        

          {!isAlive && (
          
          <section className="players-list">

                <h2>You are Dead</h2>
                
              </section>

          )}

          {gameEndVar === true && (
            <>
            <h1>GAME OVER, You {myTeam===winnerTeam ? "Won" : "Lost"}</h1>

            <h1>Winner:  {winnerTeam} Team</h1>

            <button onClick={() => startGame()}>Create New Game</button>


            </>
          )}
              
          
          <Modal isOpen={isModalOpen} onClose={closeModal}>
            
            <h1>{checkText}</h1>

          </Modal>
          <Modal isOpen={isModalOpenGameRules} onClose={closeModalGameRules}>
            <h1>Game Rules</h1>
            <p>1. Each player has a role and a team.</p>
            <p>2. The game has 2 phases: talk and battle.</p>
            <p>3. During the talk phase, players can communicate with each other.</p>
            <p>4. During the battle phase, players can check the role, team, or health of other players and kill them.</p>
            <p>5. You can only use one action per round, either check something or try to kill someone</p>
            <p>6. If you try to kill your team mates or a wrong player you will lose 1 hearth</p>
            <p>7. The game ends when all players of one team are dead.</p>
            </Modal>
          </div>
        );
      };
      
    
      return <div className="ui-background">{renderPhaseContent()}</div>;
      
};
