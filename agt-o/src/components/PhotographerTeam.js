import './PhotographerTeam.scss';
import CommandImage from './CommandImage.js';

export default function PhotographerTeam(props) {
  const { request, data, disciplines, config } = props;

  const starters = [];
  data.starters.map((v, i) => {
    starters.push(<div className="starter" key={ 'starter' + v.id }>{ v.name }</div>);
    return null;
  });

  return (
    <div className="PhotographerTeam Item">
      <span className="number">{ data.number }</span>

      <CommandImage image={ data.image } config={ config } request={ request } id={ data.id }/>

      <span className="team">
        <span className="name">{ data.name }</span>
        <div className="starters">
          { starters }
        </div>
      </span>
    </div>
  )
}
