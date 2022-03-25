import './Blocker.scss';
import Icon from './Icon.js';
export default function Blocker(props) {
  const { config } = props;

  if (!config)
    return <span style={{display: 'none'}}/>

  if (!parseInt(config.started))
    return <div className="Blocker"><Icon>logo</Icon><span>Wettkampf hat noch nicht begonnen</span></div>
  else if (parseInt(config.started) && parseInt(config.ended))
    return <div className="Blocker"><Icon>logo</Icon><span>Wettkampf wurde beendet</span></div>
  return <span style={{display: 'none'}}/>
}
