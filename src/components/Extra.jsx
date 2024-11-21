import { myPlayer } from "playroomkit";
import { useGameEngine } from "../hooks/useGameEngine";
import { useEffect } from "react";
import './styles.css';

export const UI = () => {
  const { phase, timer, players, round, actionSuccess, blueTeam, redTeam } = useGameEngine();
  const me = myPlayer();

  let myRole = '';
  let myTeam = '';
  let ability = '';

  // Determine the player's role and team
  redTeam.forEach((teamMember) => {
    if (teamMember.player.id === me.id) {
      myRole = teamMember.role;
      myTeam = 'Red';
    }
  });

  blueTeam.forEach((teamMember) => {
    if (teamMember.player.id === me.id) {
      myRole = teamMember.role;
      myTeam = 'Blue';
    }
  });

  // Set the ability based on role
  if (myRole === 'Soldier') {
    ability = 'If Killable';
  }
  if (myRole === 'Engineer') {
    ability = 'Role';
  }
  if (myRole === 'Commander') {
    ability = 'Team';
  }

  const checkFunction = (player) => {
    // Implement the logic as per your game's requirements
  };

  const renderPhaseContent = () => {
    return (
      <div className="ui-container">
        <header className="ui-header">
          <h1>Phase: {phase.charAt(0).toUpperCase() + phase.slice(1)}</h1>
          <p>Time Left: {timer}</p>
          <p>Round: {round}</p>
        </header>

        <section className="my-info">
          <h2>My Information</h2>
          <p>Role: {myRole}</p>
          <p>Team: {myTeam}</p>
        </section>

        {phase === 'talk' && (
          <section className="players-list">
            <h2>Players</h2>
            <ul>
              {players.map((player) => (
                <li key={player.id}>
                  <span>{player?.state?.profile?.name}</span>
                  <button onClick={() => checkFunction(player)}>Check {ability}</button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Add content for other phases as needed */}
      </div>
    );
  };

  return <div className="ui-background">{renderPhaseContent()}</div>;
};
