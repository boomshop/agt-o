import './Photographer.scss';
import Logout from '../components/Logout.js';
import Refresh from '../components/Refresh.js';
import PhotographerTeam from '../components/PhotographerTeam.js';
import moment from 'moment';

function notReady (teams) {
  for (let i = 0, m = teams.length; i < m; ++i ) {
    const team = teams[i];
    if (team.paid !== '1')
      return true;
    if (!team.image)
      return true;
    for (let j = 0, n = team.starters.length; j < n; ++j ) {
      const starter = team.starters[j];
      if (starter.g263 !== '1' || starter.disclaimer !== '1')
        return true;
    }
  }
}
export default function Photographer(props) {
  const { request, model, config } = props;

  const entries = [];
  if (model.teams) {
    model.teams.map((v, i) => {
      entries.push(<PhotographerTeam data={ v } config={ config } request={ request } key={ 'cteam' + v.number }/>);
      return null;
    });
  }

  return (
    <>
      <header>
        <div className="top">
          <Logout user={ props.user } onLogout={ v => request({ action: 'logout' }) }/>
          <Refresh onRefresh={ v => request({ action: 'data' }) } timeout="10" />
        </div>
      </header>
      <div className="Photographer List">
        { entries }
      </div>
    </>
  );
}
